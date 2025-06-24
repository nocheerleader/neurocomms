/*
  # Generated Scripts History Table

  1. New Tables
    - `generated_scripts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `situation_context` (text, user's situation description)
      - `relationship_type` (text, colleague/friend/family/etc)
      - `responses` (jsonb, three generated response options with explanations)
      - `selected_response` (text, which option user chose)
      - `saved_to_library` (boolean, whether any response was saved)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `generated_scripts` table
    - Add policies for users to access their own generation history
    - Track script generation usage with daily limits
    - Store structured responses for analysis and improvement
*/

-- Create generated_scripts table
CREATE TABLE IF NOT EXISTS generated_scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  situation_context text NOT NULL CHECK (char_length(situation_context) >= 1 AND char_length(situation_context) <= 1000),
  relationship_type text NOT NULL CHECK (relationship_type IN ('colleague', 'manager', 'friend', 'family', 'client', 'acquaintance', 'other')),
  responses jsonb NOT NULL,
  selected_response text CHECK (selected_response IN ('casual', 'professional', 'direct')),
  saved_to_library boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE generated_scripts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own generated scripts"
  ON generated_scripts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generated scripts"
  ON generated_scripts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generated scripts"
  ON generated_scripts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own generated scripts"
  ON generated_scripts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_generated_scripts_user_id ON generated_scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_scripts_created_at ON generated_scripts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_scripts_relationship ON generated_scripts(relationship_type);
CREATE INDEX IF NOT EXISTS idx_generated_scripts_responses ON generated_scripts USING GIN(responses);

-- Function to record script generation with usage tracking
CREATE OR REPLACE FUNCTION record_script_generation(
  p_user_id uuid,
  p_situation_context text,
  p_relationship_type text,
  p_responses jsonb
)
RETURNS uuid AS $$
DECLARE
  generation_id uuid;
  today_date date := CURRENT_DATE;
BEGIN
  -- Check usage limit
  IF NOT check_usage_limit(p_user_id, 'script_generation', today_date) THEN
    RAISE EXCEPTION 'Daily usage limit exceeded for script generation';
  END IF;
  
  -- Insert generation record
  INSERT INTO generated_scripts (user_id, situation_context, relationship_type, responses)
  VALUES (p_user_id, p_situation_context, p_relationship_type, p_responses)
  RETURNING id INTO generation_id;
  
  -- Update usage counter
  INSERT INTO daily_usage (user_id, date, script_generations_count)
  VALUES (p_user_id, today_date, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET 
    script_generations_count = daily_usage.script_generations_count + 1,
    updated_at = now();
  
  RETURN generation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update script generation with user selection
CREATE OR REPLACE FUNCTION update_script_selection(
  p_generation_id uuid,
  p_selected_response text,
  p_saved_to_library boolean DEFAULT false
)
RETURNS void AS $$
BEGIN
  UPDATE generated_scripts
  SET 
    selected_response = p_selected_response,
    saved_to_library = p_saved_to_library
  WHERE id = p_generation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get script generation insights
CREATE OR REPLACE FUNCTION get_generation_insights(p_user_id uuid, p_days integer DEFAULT 30)
RETURNS jsonb AS $$
DECLARE
  insights jsonb;
BEGIN
  WITH generation_stats AS (
    SELECT 
      COUNT(*) as total_generations,
      COUNT(selected_response) as responses_selected,
      COUNT(CASE WHEN saved_to_library THEN 1 END) as responses_saved,
      COUNT(CASE WHEN relationship_type = 'colleague' THEN 1 END) as colleague_contexts,
      COUNT(CASE WHEN relationship_type = 'manager' THEN 1 END) as manager_contexts,
      COUNT(CASE WHEN relationship_type = 'friend' THEN 1 END) as friend_contexts,
      COUNT(CASE WHEN relationship_type = 'client' THEN 1 END) as client_contexts,
      COUNT(CASE WHEN selected_response = 'professional' THEN 1 END) as professional_selected,
      COUNT(CASE WHEN selected_response = 'casual' THEN 1 END) as casual_selected,
      COUNT(CASE WHEN selected_response = 'direct' THEN 1 END) as direct_selected
    FROM generated_scripts
    WHERE user_id = p_user_id 
      AND created_at >= CURRENT_DATE - INTERVAL '%s days'
  )
  SELECT jsonb_build_object(
    'total_generations', total_generations,
    'selection_rate', CASE 
      WHEN total_generations > 0 THEN ROUND((responses_selected::decimal / total_generations) * 100, 1)
      ELSE 0 
    END,
    'save_rate', CASE 
      WHEN responses_selected > 0 THEN ROUND((responses_saved::decimal / responses_selected) * 100, 1)
      ELSE 0 
    END,
    'relationship_distribution', jsonb_build_object(
      'colleague', colleague_contexts,
      'manager', manager_contexts,
      'friend', friend_contexts,
      'client', client_contexts
    ),
    'tone_preferences', jsonb_build_object(
      'professional', professional_selected,
      'casual', casual_selected,
      'direct', direct_selected
    )
  ) INTO insights
  FROM generation_stats;
  
  RETURN COALESCE(insights, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;