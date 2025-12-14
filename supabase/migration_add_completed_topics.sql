-- Create roadmap_progress table for tracking topic completion
-- Run this migration in Supabase SQL Editor

-- Create the roadmap_progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS roadmap_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  roadmap_id INTEGER NOT NULL,
  completed_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, roadmap_id)
);

-- Enable Row Level Security
ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own progress
DROP POLICY IF EXISTS "Users can view own progress" ON roadmap_progress;
CREATE POLICY "Users can view own progress"
  ON roadmap_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own progress
DROP POLICY IF EXISTS "Users can insert own progress" ON roadmap_progress;
CREATE POLICY "Users can insert own progress"
  ON roadmap_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own progress
DROP POLICY IF EXISTS "Users can update own progress" ON roadmap_progress;
CREATE POLICY "Users can update own progress"
  ON roadmap_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own progress
DROP POLICY IF EXISTS "Users can delete own progress" ON roadmap_progress;
CREATE POLICY "Users can delete own progress"
  ON roadmap_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_roadmap_progress_user_id 
  ON roadmap_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_roadmap_progress_user_roadmap 
  ON roadmap_progress(user_id, roadmap_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_roadmap_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
DROP TRIGGER IF EXISTS update_roadmap_progress_timestamp ON roadmap_progress;
CREATE TRIGGER update_roadmap_progress_timestamp
  BEFORE UPDATE ON roadmap_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_roadmap_progress_updated_at();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully! roadmap_progress table created.';
END $$;
