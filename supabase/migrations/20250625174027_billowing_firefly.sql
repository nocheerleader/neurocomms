/*
  # Remove Tone Analysis History Features

  1. Database Changes
    - Drop the `update_analysis_title` function
    - Remove the `title` column from the `tone_analyses` table
    - Drop the `idx_tone_analyses_title` index

  2. Cleanup
    - Remove history-related database elements
    - Simplify tone_analyses table structure
*/

-- Drop the function for updating analysis titles
DROP FUNCTION IF EXISTS update_analysis_title(uuid, uuid, text);

-- Drop the title index
DROP INDEX IF EXISTS idx_tone_analyses_title;

-- Remove the title column from tone_analyses table
ALTER TABLE tone_analyses DROP COLUMN IF EXISTS title;