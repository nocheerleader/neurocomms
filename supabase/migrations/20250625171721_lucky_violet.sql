/*
  # Add Title Column to Tone Analyses

  1. Changes
    - Add `title` column to `tone_analyses` table
    - Column is nullable to support existing analyses without titles
    - Add index for better search performance on titles

  2. Security
    - No RLS changes needed as existing policies cover the new column
    - Users can only update their own analysis titles
*/

-- Add title column to tone_analyses table
ALTER TABLE tone_analyses ADD COLUMN IF NOT EXISTS title text;

-- Add index for title search performance
CREATE INDEX IF NOT EXISTS idx_tone_analyses_title ON tone_analyses(title) WHERE title IS NOT NULL;

-- Create function to update analysis title
CREATE OR REPLACE FUNCTION update_analysis_title(
  p_analysis_id uuid,
  p_user_id uuid,
  p_title text
)
RETURNS boolean AS $$
DECLARE
  updated_rows integer;
BEGIN
  UPDATE tone_analyses
  SET title = p_title
  WHERE id = p_analysis_id AND user_id = p_user_id;
  
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  
  RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;