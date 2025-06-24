/*
  # Daily Usage Tracking Table

  1. New Tables
    - `daily_usage`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `date` (date, tracking date)
      - `tone_analyses_count` (integer, daily limit 5 for free)
      - `script_generations_count` (integer, daily limit 3 for free)
      - `voice_syntheses_count` (integer, daily usage)
      - `voice_syntheses_monthly` (integer, monthly limit 10 for premium)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `daily_usage` table
    - Add policies for users to manage their own usage data
    - Create unique constraint on user_id + date
    - Add indexes for performance queries
*/

-- Create daily_usage table
CREATE TABLE IF NOT EXISTS daily_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  tone_analyses_count integer NOT NULL DEFAULT 0 CHECK (tone_analyses_count >= 0),
  script_generations_count integer NOT NULL DEFAULT 0 CHECK (script_generations_count >= 0),
  voice_syntheses_count integer NOT NULL DEFAULT 0 CHECK (voice_syntheses_count >= 0),
  voice_syntheses_monthly integer NOT NULL DEFAULT 0 CHECK (voice_syntheses_monthly >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own usage data"
  ON daily_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage data"
  ON daily_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage data"
  ON daily_usage
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_daily_usage_updated_at
  BEFORE UPDATE ON daily_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON daily_usage(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_usage_date ON daily_usage(date);

-- Create function to get or create today's usage record
CREATE OR REPLACE FUNCTION get_or_create_daily_usage(p_user_id uuid, p_date date DEFAULT CURRENT_DATE)
RETURNS daily_usage AS $$
DECLARE
  usage_record daily_usage;
BEGIN
  -- Try to get existing record
  SELECT * INTO usage_record
  FROM daily_usage
  WHERE user_id = p_user_id AND date = p_date;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO daily_usage (user_id, date)
    VALUES (p_user_id, p_date)
    RETURNING * INTO usage_record;
  END IF;
  
  RETURN usage_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check usage limits
CREATE OR REPLACE FUNCTION check_usage_limit(
  p_user_id uuid,
  p_feature_type text,
  p_date date DEFAULT CURRENT_DATE
)
RETURNS boolean AS $$
DECLARE
  usage_record daily_usage;
  user_tier text;
  can_use boolean := false;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE id = p_user_id;
  
  -- Get today's usage
  usage_record := get_or_create_daily_usage(p_user_id, p_date);
  
  -- Check limits based on feature and tier
  CASE p_feature_type
    WHEN 'tone_analysis' THEN
      can_use := (user_tier = 'premium') OR (usage_record.tone_analyses_count < 5);
    WHEN 'script_generation' THEN
      can_use := (user_tier = 'premium') OR (usage_record.script_generations_count < 3);
    WHEN 'voice_synthesis' THEN
      can_use := (user_tier = 'premium') AND (usage_record.voice_syntheses_monthly < 10);
    ELSE
      can_use := false;
  END CASE;
  
  RETURN can_use;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;