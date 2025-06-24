/*
  # Tone Analysis History Table

  1. New Tables
    - `tone_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `input_text` (text, original message analyzed)
      - `analysis_result` (jsonb, tone percentages and explanations)
      - `confidence_score` (decimal, AI confidence 0.00-1.00)
      - `processing_time_ms` (integer, analysis duration)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `tone_analyses` table
    - Add policies for users to access their own analysis history
    - Add indexes for performance on user queries
    - Store structured analysis results for insights
*/

-- Create tone_analyses table
CREATE TABLE IF NOT EXISTS tone_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text text NOT NULL CHECK (char_length(input_text) >= 1 AND char_length(input_text) <= 5000),
  analysis_result jsonb NOT NULL,
  confidence_score decimal(4,3) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  processing_time_ms integer CHECK (processing_time_ms > 0),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tone_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own tone analyses"
  ON tone_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tone analyses"
  ON tone_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tone analyses"
  ON tone_analyses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tone_analyses_user_id ON tone_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_tone_analyses_created_at ON tone_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tone_analyses_confidence ON tone_analyses(confidence_score DESC);

-- Create index on analysis_result JSONB for querying tone types
CREATE INDEX IF NOT EXISTS idx_tone_analyses_result ON tone_analyses USING GIN(analysis_result);

-- Function to record tone analysis with usage tracking
CREATE OR REPLACE FUNCTION record_tone_analysis(
  p_user_id uuid,
  p_input_text text,
  p_analysis_result jsonb,
  p_confidence_score decimal DEFAULT NULL,
  p_processing_time_ms integer DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  analysis_id uuid;
  today_date date := CURRENT_DATE;
BEGIN
  -- Check usage limit
  IF NOT check_usage_limit(p_user_id, 'tone_analysis', today_date) THEN
    RAISE EXCEPTION 'Daily usage limit exceeded for tone analysis';
  END IF;
  
  -- Insert analysis record
  INSERT INTO tone_analyses (user_id, input_text, analysis_result, confidence_score, processing_time_ms)
  VALUES (p_user_id, p_input_text, p_analysis_result, p_confidence_score, p_processing_time_ms)
  RETURNING id INTO analysis_id;
  
  -- Update usage counter
  INSERT INTO daily_usage (user_id, date, tone_analyses_count)
  VALUES (p_user_id, today_date, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET 
    tone_analyses_count = daily_usage.tone_analyses_count + 1,
    updated_at = now();
  
  RETURN analysis_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get analysis statistics for user insights
CREATE OR REPLACE FUNCTION get_analysis_insights(p_user_id uuid, p_days integer DEFAULT 30)
RETURNS jsonb AS $$
DECLARE
  insights jsonb;
BEGIN
  WITH analysis_stats AS (
    SELECT 
      COUNT(*) as total_analyses,
      AVG(confidence_score) as avg_confidence,
      AVG(processing_time_ms) as avg_processing_time,
      -- Extract tone percentages from analysis_result
      AVG((analysis_result->>'professional')::decimal) as avg_professional,
      AVG((analysis_result->>'friendly')::decimal) as avg_friendly,
      AVG((analysis_result->>'urgent')::decimal) as avg_urgent,
      AVG((analysis_result->>'neutral')::decimal) as avg_neutral
    FROM tone_analyses
    WHERE user_id = p_user_id 
      AND created_at >= CURRENT_DATE - INTERVAL '%s days'
  )
  SELECT jsonb_build_object(
    'total_analyses', total_analyses,
    'avg_confidence', ROUND(avg_confidence, 3),
    'avg_processing_time_ms', ROUND(avg_processing_time),
    'tone_distribution', jsonb_build_object(
      'professional', ROUND(avg_professional, 1),
      'friendly', ROUND(avg_friendly, 1),
      'urgent', ROUND(avg_urgent, 1),
      'neutral', ROUND(avg_neutral, 1)
    )
  ) INTO insights
  FROM analysis_stats;
  
  RETURN COALESCE(insights, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;