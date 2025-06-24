/*
  # Personal Scripts Library Table

  1. New Tables
    - `personal_scripts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, script title)
      - `content` (text, script content with full-text search)
      - `category_id` (uuid, foreign key to script_categories)
      - `tags` (text array, searchable tags)
      - `usage_count` (integer, times used)
      - `success_rate` (decimal, user rating 0-100%)
      - `last_used_at` (timestamptz, when last copied/used)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `personal_scripts` table
    - Add policies for users to manage their own scripts
    - Add full-text search index on title and content
    - Limit free users to 1000 scripts total
*/

-- Create personal_scripts table
CREATE TABLE IF NOT EXISTS personal_scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 200),
  content text NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 10000),
  category_id uuid REFERENCES script_categories(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  usage_count integer NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
  success_rate decimal(5,2) CHECK (success_rate >= 0 AND success_rate <= 100),
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE personal_scripts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own scripts"
  ON personal_scripts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scripts"
  ON personal_scripts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scripts"
  ON personal_scripts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scripts"
  ON personal_scripts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_personal_scripts_updated_at
  BEFORE UPDATE ON personal_scripts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_personal_scripts_user_id ON personal_scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_scripts_category ON personal_scripts(category_id);
CREATE INDEX IF NOT EXISTS idx_personal_scripts_tags ON personal_scripts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_personal_scripts_usage ON personal_scripts(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_personal_scripts_last_used ON personal_scripts(last_used_at DESC);

-- Create full-text search index
ALTER TABLE personal_scripts ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_personal_scripts_search_vector
  BEFORE INSERT OR UPDATE ON personal_scripts
  FOR EACH ROW
  EXECUTE FUNCTION update_search_vector();

CREATE INDEX IF NOT EXISTS idx_personal_scripts_search ON personal_scripts USING GIN(search_vector);

-- Function to check script limit for free users
CREATE OR REPLACE FUNCTION check_script_limit(p_user_id uuid)
RETURNS boolean AS $$
DECLARE
  script_count integer;
  user_tier text;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE id = p_user_id;
  
  -- Premium users have no limit
  IF user_tier = 'premium' THEN
    RETURN true;
  END IF;
  
  -- Count existing scripts for free users
  SELECT COUNT(*) INTO script_count
  FROM personal_scripts
  WHERE user_id = p_user_id;
  
  RETURN script_count < 1000;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_script_usage(p_script_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE personal_scripts
  SET 
    usage_count = usage_count + 1,
    last_used_at = now(),
    updated_at = now()
  WHERE id = p_script_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;