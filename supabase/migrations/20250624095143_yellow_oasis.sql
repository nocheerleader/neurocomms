/*
  # Script Categories Table

  1. New Tables
    - `script_categories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, category name)
      - `color` (text, hex color code)
      - `description` (text, optional description)
      - `parent_category_id` (uuid, optional parent for nesting)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `script_categories` table
    - Add policies for users to manage their own categories
    - Add foreign key constraint for hierarchical categories
    - Create default categories for new users
*/

-- Create script_categories table
CREATE TABLE IF NOT EXISTS script_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
  color text NOT NULL DEFAULT '#8B5CF6' CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
  description text CHECK (char_length(description) <= 500),
  parent_category_id uuid REFERENCES script_categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE script_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own categories"
  ON script_categories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON script_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON script_categories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON script_categories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_script_categories_updated_at
  BEFORE UPDATE ON script_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_script_categories_user_id ON script_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_script_categories_parent ON script_categories(parent_category_id);

-- Create function to create default categories for new users
CREATE OR REPLACE FUNCTION create_default_categories(p_user_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO script_categories (user_id, name, color, description) VALUES
    (p_user_id, 'Work Emails', '#3B82F6', 'Professional email responses and communications'),
    (p_user_id, 'Social Messages', '#10B981', 'Personal and social communication scripts'),
    (p_user_id, 'Meeting Responses', '#8B5CF6', 'Responses for meetings and video calls'),
    (p_user_id, 'Customer Service', '#F59E0B', 'Client and customer interaction scripts'),
    (p_user_id, 'Quick Replies', '#EF4444', 'Short, frequently used responses')
  ON CONFLICT (user_id, name) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the handle_new_user function to include default categories
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id)
  VALUES (new.id);
  
  -- Create default categories
  PERFORM create_default_categories(new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;