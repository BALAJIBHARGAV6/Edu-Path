-- Migration: Fix user_profiles schema and constraints
-- Run this in your Supabase SQL Editor

-- Make full_name nullable to allow profile creation without name initially
ALTER TABLE user_profiles ALTER COLUMN full_name DROP NOT NULL;

-- Add total_xp column if it doesn't exist (for dashboard)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0;

-- Ensure user_skills table exists with correct foreign key
CREATE TABLE IF NOT EXISTS user_skills (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  category TEXT,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced')),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user_id ON roadmaps(user_id);

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for user_skills
DROP POLICY IF EXISTS "Users can view own skills" ON user_skills;
CREATE POLICY "Users can view own skills" ON user_skills
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own skills" ON user_skills;
CREATE POLICY "Users can insert own skills" ON user_skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own skills" ON user_skills;
CREATE POLICY "Users can delete own skills" ON user_skills
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for roadmaps
DROP POLICY IF EXISTS "Users can view own roadmaps" ON roadmaps;
CREATE POLICY "Users can view own roadmaps" ON roadmaps
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own roadmaps" ON roadmaps;
CREATE POLICY "Users can insert own roadmaps" ON roadmaps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own roadmaps" ON roadmaps;
CREATE POLICY "Users can update own roadmaps" ON roadmaps
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own roadmaps" ON roadmaps;
CREATE POLICY "Users can delete own roadmaps" ON roadmaps
  FOR DELETE USING (auth.uid() = user_id);
