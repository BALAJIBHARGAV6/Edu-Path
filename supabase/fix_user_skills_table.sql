-- Migration: Drop and recreate user_skills table with correct schema
-- Run this in your Supabase SQL Editor

-- Drop the existing user_skills table with wrong schema
DROP TABLE IF EXISTS user_skills CASCADE;

-- Create user_skills table with correct schema
CREATE TABLE user_skills (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  category TEXT,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced')),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);

-- Create index for faster lookups
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);

-- Enable Row Level Security
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_skills
CREATE POLICY "Users can view own skills" ON user_skills
  FOR SELECT USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Users can insert own skills" ON user_skills
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Users can delete own skills" ON user_skills
  FOR DELETE USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'service_role');
