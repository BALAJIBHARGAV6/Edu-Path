-- EduPath AI - Complete Advanced Database Schema
-- Run this in your Supabase SQL Editor
-- This is a complete rebuild with all tables for the advanced platform

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- DROP EXISTING TABLES (for clean rebuild)
-- ============================================
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS learning_sessions CASCADE;
DROP TABLE IF EXISTS user_notes CASCADE;
DROP TABLE IF EXISTS generated_notes CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS user_node_progress CASCADE;
DROP TABLE IF EXISTS user_solutions CASCADE;
DROP TABLE IF EXISTS practice_problems CASCADE;
DROP TABLE IF EXISTS roadmap_nodes CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS roadmaps CASCADE;
DROP TABLE IF EXISTS user_skills CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS user_onboarding CASCADE;
DROP TABLE IF EXISTS user_statistics CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- ============================================
-- CORE USER TABLES
-- ============================================

-- User Profiles (extends Supabase Auth)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Onboarding Data (Core preferences)
CREATE TABLE user_onboarding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Step 1: Goals
  primary_goal TEXT CHECK (primary_goal IN ('career_change', 'skill_upgrade', 'certification', 'hobby')),
  target_roles TEXT[] DEFAULT '{}',
  learning_motivation TEXT,
  -- Step 2: Current Skills
  current_skills JSONB DEFAULT '[]', -- [{name, proficiency: beginner/intermediate/advanced}]
  years_experience INTEGER DEFAULT 0,
  -- Step 3: Availability
  weekly_hours INTEGER DEFAULT 10,
  preferred_schedule TEXT[] DEFAULT '{}', -- ['morning', 'evening', 'weekend']
  target_completion_date DATE,
  -- Step 4: Learning Preferences
  learning_style TEXT[] DEFAULT '{}', -- ['videos', 'reading', 'hands-on', 'projects']
  preferred_difficulty TEXT CHECK (preferred_difficulty IN ('gentle', 'moderate', 'intensive')) DEFAULT 'moderate',
  -- Metadata
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Statistics (Aggregated metrics)
CREATE TABLE user_statistics (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_skills_learning INTEGER DEFAULT 0,
  total_nodes_completed INTEGER DEFAULT 0,
  total_nodes_available INTEGER DEFAULT 0,
  overall_progress_percent DECIMAL(5,2) DEFAULT 0,
  total_learning_hours DECIMAL(10,2) DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  problems_solved INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  milestones_reached TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SKILLS LIBRARY
-- ============================================

-- Master Skills Library
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  icon_name TEXT, -- Lucide icon name
  color TEXT, -- Hex color for UI
  difficulty_levels JSONB DEFAULT '{"beginner": {"topics": 18, "hours": 140}, "intermediate": {"topics": 14, "hours": 100}, "advanced": {"topics": 10, "hours": 70}}',
  prerequisites TEXT[] DEFAULT '{}',
  trending_score INTEGER DEFAULT 50,
  learner_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Selected Skills (Active learning)
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  selected_level TEXT CHECK (selected_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  status TEXT CHECK (status IN ('active', 'paused', 'completed')) DEFAULT 'active',
  progress_percent DECIMAL(5,2) DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, skill_id)
);

-- ============================================
-- AI ROADMAPS & FLOWCHARTS
-- ============================================

-- AI Generated Roadmaps
CREATE TABLE roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  skill_name TEXT NOT NULL,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  title TEXT NOT NULL,
  description TEXT,
  flowchart_data JSONB, -- Complete React Flow data {nodes, edges}
  estimated_hours INTEGER,
  total_topics INTEGER,
  completed_topics INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roadmap Nodes (Individual topics in flowchart)
CREATE TABLE roadmap_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  node_id TEXT NOT NULL, -- React Flow node ID
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  parent_nodes TEXT[] DEFAULT '{}', -- IDs of prerequisite nodes
  child_nodes TEXT[] DEFAULT '{}', -- IDs of unlocked nodes
  key_concepts TEXT[] DEFAULT '{}',
  estimated_hours DECIMAL(4,1),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  video_keywords TEXT[] DEFAULT '{}',
  practice_topics TEXT[] DEFAULT '{}',
  position_x DECIMAL(10,2) DEFAULT 0,
  position_y DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(roadmap_id, node_id)
);

-- User Node Progress
CREATE TABLE user_node_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id UUID REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('locked', 'available', 'in_progress', 'completed')) DEFAULT 'locked',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  notes_generated BOOLEAN DEFAULT FALSE,
  videos_watched INTEGER DEFAULT 0,
  practice_completed INTEGER DEFAULT 0,
  UNIQUE(user_id, node_id)
);

-- ============================================
-- PRACTICE PROBLEMS
-- ============================================

-- Practice Problems Library
CREATE TABLE practice_problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
  category TEXT NOT NULL, -- 'arrays', 'strings', 'react', 'sql', etc.
  related_skills TEXT[] DEFAULT '{}',
  starter_code JSONB DEFAULT '{}', -- {javascript: "...", python: "..."}
  test_cases JSONB NOT NULL, -- [{input, expected_output, is_hidden}]
  hints TEXT[] DEFAULT '{}',
  solution JSONB DEFAULT '{}', -- {javascript: "...", python: "..."}
  explanation TEXT,
  acceptance_rate DECIMAL(5,2) DEFAULT 50,
  times_solved INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Solutions
CREATE TABLE user_solutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id UUID REFERENCES practice_problems(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT CHECK (status IN ('accepted', 'wrong_answer', 'runtime_error', 'time_limit')) NOT NULL,
  test_cases_passed INTEGER DEFAULT 0,
  test_cases_total INTEGER DEFAULT 0,
  execution_time_ms INTEGER,
  memory_used_kb INTEGER,
  score INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NOTES & RESOURCES
-- ============================================

-- AI Generated Notes
CREATE TABLE generated_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id UUID REFERENCES roadmap_nodes(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  skill_context TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  content TEXT NOT NULL, -- Markdown content
  sections JSONB DEFAULT '{}', -- {overview, key_concepts, examples, best_practices, resources}
  is_saved BOOLEAN DEFAULT FALSE,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Custom Notes
CREATE TABLE user_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id UUID REFERENCES roadmap_nodes(id) ON DELETE SET NULL,
  title TEXT,
  content TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LEARNING SESSIONS & ACTIVITY
-- ============================================

-- Learning Sessions (Time tracking)
CREATE TABLE learning_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id UUID REFERENCES roadmap_nodes(id) ON DELETE SET NULL,
  activity_type TEXT CHECK (activity_type IN ('video', 'reading', 'practice', 'notes')) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER
);

-- User Activity Feed
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'completed_topic', 'solved_problem', 'generated_notes', 'earned_achievement'
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ACHIEVEMENTS
-- ============================================

-- Achievements Library
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  category TEXT CHECK (category IN ('progress', 'streak', 'practice', 'learning')),
  criteria JSONB NOT NULL,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_user_onboarding_user_id ON user_onboarding(user_id);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_status ON user_skills(status);
CREATE INDEX idx_roadmaps_user_id ON roadmaps(user_id);
CREATE INDEX idx_roadmaps_skill_id ON roadmaps(skill_id);
CREATE INDEX idx_roadmaps_is_active ON roadmaps(is_active);
CREATE INDEX idx_roadmap_nodes_roadmap_id ON roadmap_nodes(roadmap_id);
CREATE INDEX idx_user_node_progress_user_id ON user_node_progress(user_id);
CREATE INDEX idx_user_node_progress_status ON user_node_progress(status);
CREATE INDEX idx_practice_problems_difficulty ON practice_problems(difficulty);
CREATE INDEX idx_practice_problems_category ON practice_problems(category);
CREATE INDEX idx_user_solutions_user_id ON user_solutions(user_id);
CREATE INDEX idx_generated_notes_user_id ON generated_notes(user_id);
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_created_at ON user_activity(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_node_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User Onboarding Policies
CREATE POLICY "Users can view own onboarding" ON user_onboarding FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own onboarding" ON user_onboarding FOR ALL USING (auth.uid() = user_id);

-- User Statistics Policies
CREATE POLICY "Users can view own stats" ON user_statistics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own stats" ON user_statistics FOR ALL USING (auth.uid() = user_id);

-- User Skills Policies
CREATE POLICY "Users can view own skills" ON user_skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own skills" ON user_skills FOR ALL USING (auth.uid() = user_id);

-- Roadmaps Policies
CREATE POLICY "Users can view own roadmaps" ON roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own roadmaps" ON roadmaps FOR ALL USING (auth.uid() = user_id);

-- Roadmap Nodes Policies (through roadmap ownership)
CREATE POLICY "Users can view own roadmap nodes" ON roadmap_nodes FOR SELECT USING (
  EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = roadmap_nodes.roadmap_id AND roadmaps.user_id = auth.uid())
);
CREATE POLICY "Users can manage own roadmap nodes" ON roadmap_nodes FOR ALL USING (
  EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = roadmap_nodes.roadmap_id AND roadmaps.user_id = auth.uid())
);

-- User Node Progress Policies
CREATE POLICY "Users can view own node progress" ON user_node_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own node progress" ON user_node_progress FOR ALL USING (auth.uid() = user_id);

-- User Solutions Policies
CREATE POLICY "Users can view own solutions" ON user_solutions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own solutions" ON user_solutions FOR ALL USING (auth.uid() = user_id);

-- Generated Notes Policies
CREATE POLICY "Users can view own generated notes" ON generated_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own generated notes" ON generated_notes FOR ALL USING (auth.uid() = user_id);

-- User Notes Policies
CREATE POLICY "Users can view own notes" ON user_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notes" ON user_notes FOR ALL USING (auth.uid() = user_id);

-- Learning Sessions Policies
CREATE POLICY "Users can view own sessions" ON learning_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sessions" ON learning_sessions FOR ALL USING (auth.uid() = user_id);

-- User Activity Policies
CREATE POLICY "Users can view own activity" ON user_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own activity" ON user_activity FOR ALL USING (auth.uid() = user_id);

-- User Achievements Policies
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);

-- Skills & Problems are public read
CREATE POLICY "Anyone can view skills" ON skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view problems" ON practice_problems FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT TO authenticated USING (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_onboarding_updated_at BEFORE UPDATE ON user_onboarding FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_statistics_updated_at BEFORE UPDATE ON user_statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roadmaps_updated_at BEFORE UPDATE ON roadmaps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_notes_updated_at BEFORE UPDATE ON generated_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_notes_updated_at BEFORE UPDATE ON user_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to unlock child nodes when parent is completed
CREATE OR REPLACE FUNCTION unlock_child_nodes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Get the node's children and unlock them
    UPDATE user_node_progress unp
    SET status = 'available'
    FROM roadmap_nodes rn
    WHERE rn.id = unp.node_id
    AND unp.user_id = NEW.user_id
    AND unp.status = 'locked'
    AND EXISTS (
      SELECT 1 FROM roadmap_nodes parent_node
      WHERE parent_node.id = NEW.node_id
      AND rn.node_id = ANY(parent_node.child_nodes)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_unlock_child_nodes
AFTER UPDATE ON user_node_progress
FOR EACH ROW EXECUTE FUNCTION unlock_child_nodes();

-- Function to update user statistics
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE user_statistics
    SET 
      total_nodes_completed = total_nodes_completed + 1,
      overall_progress_percent = (
        SELECT (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / NULLIF(COUNT(*), 0) * 100)
        FROM user_node_progress WHERE user_id = NEW.user_id
      ),
      last_activity_date = CURRENT_DATE
    WHERE user_id = NEW.user_id;
    
    -- Add activity
    INSERT INTO user_activity (user_id, activity_type, title, metadata)
    SELECT NEW.user_id, 'completed_topic', rn.title, jsonb_build_object('node_id', NEW.node_id)
    FROM roadmap_nodes rn WHERE rn.id = NEW.node_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_stats
AFTER UPDATE ON user_node_progress
FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- ============================================
-- SEED DATA: SKILLS LIBRARY
-- ============================================

INSERT INTO skills (name, slug, category, description, icon_name, color, trending_score, learner_count) VALUES
('Frontend Development', 'frontend', 'Web Development', 'Build beautiful, responsive user interfaces with modern frameworks', 'Code2', '#3B82F6', 95, 45200),
('Backend Development', 'backend', 'Web Development', 'Create scalable APIs and server-side applications', 'Server', '#10B981', 90, 38100),
('Full Stack Development', 'fullstack', 'Web Development', 'Master both frontend and backend technologies', 'Layers', '#8B5CF6', 98, 52300),
('DevOps & Cloud', 'devops', 'Infrastructure', 'Automate deployments and manage cloud infrastructure', 'Cloud', '#F59E0B', 85, 28400),
('Mobile Development', 'mobile', 'Mobile', 'Create native and cross-platform mobile applications', 'Smartphone', '#06B6D4', 80, 31500),
('Data Science & ML', 'data-science', 'Data', 'Analyze data and build machine learning models', 'Brain', '#EC4899', 92, 25800),
('UI/UX Design', 'ui-ux', 'Design', 'Design intuitive and beautiful user experiences', 'Palette', '#FBBF24', 75, 22100),
('Cybersecurity', 'security', 'Security', 'Protect systems and data from cyber threats', 'Shield', '#EF4444', 88, 19500);

-- ============================================
-- SEED DATA: PRACTICE PROBLEMS
-- ============================================

INSERT INTO practice_problems (title, slug, description, difficulty, category, related_skills, starter_code, test_cases, hints, solution, explanation) VALUES
(
  'Two Sum',
  'two-sum',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
  'easy',
  'arrays',
  ARRAY['javascript', 'python', 'algorithms'],
  '{"javascript": "function twoSum(nums, target) {\n  // Your code here\n}", "python": "def two_sum(nums, target):\n    # Your code here\n    pass"}',
  '[{"input": {"nums": [2,7,11,15], "target": 9}, "expected": [0,1]}, {"input": {"nums": [3,2,4], "target": 6}, "expected": [1,2]}, {"input": {"nums": [3,3], "target": 6}, "expected": [0,1]}]',
  ARRAY['Try using a hash map to store seen values', 'For each number, check if target - number exists in the map'],
  '{"javascript": "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}"}',
  'Use a hash map to store each number and its index. For each number, check if its complement (target - number) exists in the map. This gives O(n) time complexity.'
),
(
  'Valid Parentheses',
  'valid-parentheses',
  'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.',
  'easy',
  'strings',
  ARRAY['javascript', 'python', 'stacks'],
  '{"javascript": "function isValid(s) {\n  // Your code here\n}", "python": "def is_valid(s):\n    # Your code here\n    pass"}',
  '[{"input": "()", "expected": true}, {"input": "()[]{}", "expected": true}, {"input": "(]", "expected": false}, {"input": "([)]", "expected": false}]',
  ARRAY['Use a stack data structure', 'Push opening brackets, pop and compare for closing brackets'],
  '{"javascript": "function isValid(s) {\n  const stack = [];\n  const map = { '')'': ''('', ''}'': ''{'', '']'': ''['' };\n  for (const char of s) {\n    if (char in map) {\n      if (stack.pop() !== map[char]) return false;\n    } else {\n      stack.push(char);\n    }\n  }\n  return stack.length === 0;\n}"}',
  'Use a stack to track opening brackets. When encountering a closing bracket, check if it matches the most recent opening bracket.'
),
(
  'Reverse Linked List',
  'reverse-linked-list',
  'Given the head of a singly linked list, reverse the list, and return the reversed list.',
  'medium',
  'linked-lists',
  ARRAY['javascript', 'python', 'data-structures'],
  '{"javascript": "function reverseList(head) {\n  // Your code here\n}", "python": "def reverse_list(head):\n    # Your code here\n    pass"}',
  '[{"input": [1,2,3,4,5], "expected": [5,4,3,2,1]}, {"input": [1,2], "expected": [2,1]}, {"input": [], "expected": []}]',
  ARRAY['Use three pointers: prev, current, next', 'Iterate through the list, reversing pointers as you go'],
  '{"javascript": "function reverseList(head) {\n  let prev = null;\n  let current = head;\n  while (current) {\n    const next = current.next;\n    current.next = prev;\n    prev = current;\n    current = next;\n  }\n  return prev;\n}"}',
  'Use iterative approach with three pointers. At each step, save the next node, reverse the current pointer, and move forward.'
),
(
  'Build a React Counter',
  'react-counter',
  'Create a React component that displays a counter with increment and decrement buttons. The counter should start at 0 and update when buttons are clicked.',
  'easy',
  'react',
  ARRAY['react', 'javascript', 'frontend'],
  '{"javascript": "function Counter() {\n  // Use useState hook\n  // Return JSX with count display and buttons\n}"}',
  '[{"input": "increment", "expected": 1}, {"input": "decrement", "expected": -1}]',
  ARRAY['Use the useState hook to manage count state', 'Create onClick handlers for the buttons'],
  '{"javascript": "function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n      <button onClick={() => setCount(count - 1)}>-</button>\n    </div>\n  );\n}"}',
  'Use useState to create a count state variable. Attach onClick handlers to buttons that update the state.'
),
(
  'REST API Endpoint',
  'rest-api-endpoint',
  'Create an Express.js endpoint that accepts a POST request with a JSON body containing a name, and returns a greeting message.',
  'easy',
  'node',
  ARRAY['nodejs', 'express', 'backend'],
  '{"javascript": "app.post(''/greet'', (req, res) => {\n  // Your code here\n});"}',
  '[{"input": {"name": "John"}, "expected": {"message": "Hello, John!"}}]',
  ARRAY['Access the request body using req.body', 'Send JSON response using res.json()'],
  '{"javascript": "app.post(''/greet'', (req, res) => {\n  const { name } = req.body;\n  res.json({ message: `Hello, ${name}!` });\n});"}',
  'Extract the name from req.body and return a JSON response with the greeting message.'
);

-- ============================================
-- SEED DATA: ACHIEVEMENTS
-- ============================================

INSERT INTO achievements (name, description, icon, category, criteria, points) VALUES
('First Steps', 'Complete your first topic', 'trophy', 'progress', '{"nodes_completed": 1}', 10),
('Getting Started', 'Complete 5 topics', 'flag', 'progress', '{"nodes_completed": 5}', 25),
('On a Roll', 'Complete 10 topics', 'zap', 'progress', '{"nodes_completed": 10}', 50),
('Halfway Hero', 'Complete 50% of a roadmap', 'target', 'progress', '{"roadmap_progress": 50}', 100),
('Path Master', 'Complete an entire roadmap', 'award', 'progress', '{"roadmap_completed": true}', 250),
('Week Warrior', 'Maintain a 7-day streak', 'flame', 'streak', '{"streak_days": 7}', 50),
('Month Master', 'Maintain a 30-day streak', 'fire', 'streak', '{"streak_days": 30}', 200),
('Problem Solver', 'Solve your first practice problem', 'code', 'practice', '{"problems_solved": 1}', 15),
('Code Ninja', 'Solve 10 practice problems', 'terminal', 'practice', '{"problems_solved": 10}', 75),
('Algorithm Ace', 'Solve 25 practice problems', 'cpu', 'practice', '{"problems_solved": 25}', 150),
('Note Taker', 'Generate 5 AI study notes', 'file-text', 'learning', '{"notes_generated": 5}', 30),
('Knowledge Seeker', 'Watch 10 tutorial videos', 'play', 'learning', '{"videos_watched": 10}', 40),
('Multi-Skilled', 'Start learning 3 different skills', 'layers', 'progress', '{"skills_started": 3}', 75);

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
-- Schema created successfully!
-- Run this in Supabase SQL Editor to set up your database.
