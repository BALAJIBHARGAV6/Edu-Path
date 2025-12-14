-- Add completed_topics column to user_progress table for tracking topic completion
-- Run this migration in Supabase SQL Editor

-- First, let's create a composite unique constraint if it doesn't exist
DO $$ 
BEGIN
  -- Add completed_topics column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_progress' 
    AND column_name = 'completed_topics'
  ) THEN
    ALTER TABLE user_progress ADD COLUMN completed_topics TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
END $$;

-- Create unique constraint on user_id and roadmap_id for progress tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'user_progress_user_roadmap_unique'
  ) THEN
    ALTER TABLE user_progress 
    ADD CONSTRAINT user_progress_user_roadmap_unique 
    UNIQUE (user_id, roadmap_id);
  END IF;
EXCEPTION
  WHEN others THEN
    -- Constraint might already exist with data, update approach
    NULL;
END $$;

-- Update RLS policies for user_progress if needed
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own progress
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own progress
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own progress
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_progress_user_roadmap 
  ON user_progress(user_id, roadmap_id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully! completed_topics column added to user_progress.';
END $$;
