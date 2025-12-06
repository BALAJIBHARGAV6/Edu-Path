-- EduPath AI Schema Update
-- Run this AFTER the initial schema.sql

-- =============================================
-- NEW TABLES FOR TESTS, PRACTICE, SAVED RESOURCES
-- =============================================

-- Practice challenges table
CREATE TABLE IF NOT EXISTS practice_challenges (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  category TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  starter_code TEXT,
  solution TEXT,
  test_cases JSONB DEFAULT '[]',
  hints TEXT[] DEFAULT '{}',
  points INTEGER DEFAULT 10,
  time_limit_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User practice attempts
CREATE TABLE IF NOT EXISTS user_practice_attempts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  challenge_id INTEGER REFERENCES practice_challenges(id) ON DELETE CASCADE,
  code_submitted TEXT,
  is_correct BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  time_taken_seconds INTEGER,
  feedback TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tests/Quizzes table
CREATE TABLE IF NOT EXISTS tests (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  milestone_id INTEGER REFERENCES milestones(id) ON DELETE CASCADE,
  topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
  questions JSONB NOT NULL, -- Array of {question, options, correct_answer, explanation}
  passing_score INTEGER DEFAULT 70,
  time_limit_minutes INTEGER DEFAULT 15,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User test results
CREATE TABLE IF NOT EXISTS user_test_results (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  answers JSONB NOT NULL, -- User's answers
  passed BOOLEAN DEFAULT FALSE,
  time_taken_seconds INTEGER,
  feedback TEXT,
  path_adjustment TEXT, -- 'accelerate', 'maintain', 'remediate'
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved resources
CREATE TABLE IF NOT EXISTS saved_resources (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  resource_type TEXT CHECK (resource_type IN ('video', 'article', 'note', 'course')) NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  thumbnail TEXT,
  channel_name TEXT,
  description TEXT,
  content TEXT, -- For saved notes
  tags TEXT[] DEFAULT '{}',
  is_completed BOOLEAN DEFAULT FALSE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, url)
);

-- Recommended channels (curated educational channels)
CREATE TABLE IF NOT EXISTS recommended_channels (
  id SERIAL PRIMARY KEY,
  channel_id TEXT UNIQUE NOT NULL,
  channel_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  subscriber_count INTEGER,
  quality_score INTEGER DEFAULT 80, -- 0-100 rating
  is_verified BOOLEAN DEFAULT TRUE,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User performance metrics
CREATE TABLE IF NOT EXISTS user_performance (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  roadmap_id INTEGER REFERENCES roadmaps(id) ON DELETE CASCADE,
  avg_test_score DECIMAL(5,2) DEFAULT 0,
  tests_taken INTEGER DEFAULT 0,
  tests_passed INTEGER DEFAULT 0,
  challenges_completed INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  current_level TEXT DEFAULT 'beginner',
  learning_velocity TEXT DEFAULT 'normal', -- 'slow', 'normal', 'fast'
  last_assessment_date TIMESTAMP WITH TIME ZONE,
  path_adjustments_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, roadmap_id)
);

-- Path adjustment history
CREATE TABLE IF NOT EXISTS path_adjustments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  roadmap_id INTEGER REFERENCES roadmaps(id) ON DELETE CASCADE,
  adjustment_type TEXT CHECK (adjustment_type IN ('accelerate', 'maintain', 'remediate', 'skip', 'add_topic')) NOT NULL,
  reason TEXT,
  old_path JSONB,
  new_path JSONB,
  triggered_by TEXT, -- 'test_result', 'practice_performance', 'manual'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_practice_challenges_category ON practice_challenges(category);
CREATE INDEX IF NOT EXISTS idx_user_practice_attempts_user_id ON user_practice_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_tests_milestone_id ON tests(milestone_id);
CREATE INDEX IF NOT EXISTS idx_user_test_results_user_id ON user_test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_resources_user_id ON saved_resources(user_id);
CREATE INDEX IF NOT EXISTS idx_recommended_channels_category ON recommended_channels(category);
CREATE INDEX IF NOT EXISTS idx_user_performance_user_id ON user_performance(user_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE practice_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_practice_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommended_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE path_adjustments ENABLE ROW LEVEL SECURITY;

-- Public read for challenges and channels
CREATE POLICY "Anyone can view challenges" ON practice_challenges FOR SELECT USING (true);
CREATE POLICY "Anyone can view channels" ON recommended_channels FOR SELECT USING (true);
CREATE POLICY "Anyone can view tests" ON tests FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users can manage own practice attempts" ON user_practice_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own test results" ON user_test_results FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own saved resources" ON saved_resources FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own performance" ON user_performance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own performance" ON user_performance FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own path adjustments" ON path_adjustments FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- INSERT RECOMMENDED CHANNELS
-- =============================================
INSERT INTO recommended_channels (channel_id, channel_name, description, category, skills, quality_score) VALUES
  ('UCW5YeuERMmlnqo4oq8vwUpg', 'The Net Ninja', 'Web development tutorials', 'frontend', ARRAY['javascript', 'react', 'vue', 'css'], 95),
  ('UC8butISFwT-Wl7EV0hUK0BQ', 'freeCodeCamp', 'Full programming courses', 'fullstack', ARRAY['javascript', 'python', 'react', 'node'], 98),
  ('UCvjgXvBlLQH5CTM0lkqKPwg', 'Traversy Media', 'Web development crash courses', 'frontend', ARRAY['javascript', 'react', 'node', 'css'], 94),
  ('UCsBjURrPoezykLs9EqgamOA', 'Fireship', 'Quick tech explanations', 'fullstack', ARRAY['javascript', 'firebase', 'react', 'flutter'], 96),
  ('UC29ju8bIPH5as8OGnQzwJyA', 'Traversy Media', 'Backend development', 'backend', ARRAY['node', 'python', 'mongodb', 'sql'], 93),
  ('UCFbNIlppjAuEX4znoulh0Cw', 'Web Dev Simplified', 'Simplified web tutorials', 'frontend', ARRAY['javascript', 'react', 'css', 'html'], 94),
  ('UC-8QAzbLcRglXeN_MY9blyw', 'Ben Awad', 'React and GraphQL', 'frontend', ARRAY['react', 'graphql', 'typescript', 'node'], 90),
  ('UCmXmlB4-HJytD7wek0Ber3A', 'The Coding Train', 'Creative coding', 'programming', ARRAY['javascript', 'p5js', 'algorithms'], 92),
  ('UCWN3xxRkmTPmbKwht9FuE5A', 'Siraj Raval', 'AI and Machine Learning', 'ml', ARRAY['python', 'tensorflow', 'ml', 'ai'], 85),
  ('UCvjgXvBlLQH5CTM0lkqKPwg', 'Academind', 'In-depth web courses', 'fullstack', ARRAY['javascript', 'react', 'angular', 'node'], 93),
  ('UC4JX40jDee_tINbkjycV4Sg', 'Tech With Tim', 'Python tutorials', 'backend', ARRAY['python', 'django', 'flask', 'ml'], 91),
  ('UCeVMnSShP_Iviwkknt83cww', 'Code With Harry', 'Hindi programming', 'fullstack', ARRAY['python', 'javascript', 'java', 'c++'], 89),
  ('UCnUYZLuoy1rq1aVMwx4aTzw', 'Google Chrome Developers', 'Web performance', 'frontend', ARRAY['javascript', 'pwa', 'performance'], 95),
  ('UCzoVCacndDCfGDf41P-z0iA', 'JSConf', 'JavaScript conferences', 'frontend', ARRAY['javascript', 'node', 'react'], 90),
  ('UC-T8W79DN6PBnzomelvqJYw', 'Programming with Mosh', 'Programming fundamentals', 'fullstack', ARRAY['javascript', 'python', 'react', 'node'], 94)
ON CONFLICT (channel_id) DO NOTHING;

-- =============================================
-- INSERT SAMPLE PRACTICE CHALLENGES
-- =============================================
INSERT INTO practice_challenges (title, description, difficulty, category, skills, starter_code, points) VALUES
  ('Two Sum', 'Find two numbers that add up to target', 'easy', 'algorithms', ARRAY['javascript', 'arrays'], 'function twoSum(nums, target) {\n  // Your code here\n}', 10),
  ('Reverse String', 'Reverse a string without built-in methods', 'easy', 'algorithms', ARRAY['javascript', 'strings'], 'function reverseString(str) {\n  // Your code here\n}', 10),
  ('FizzBuzz', 'Classic FizzBuzz problem', 'easy', 'algorithms', ARRAY['javascript', 'loops'], 'function fizzBuzz(n) {\n  // Your code here\n}', 10),
  ('Palindrome Check', 'Check if string is palindrome', 'easy', 'algorithms', ARRAY['javascript', 'strings'], 'function isPalindrome(str) {\n  // Your code here\n}', 10),
  ('Binary Search', 'Implement binary search algorithm', 'medium', 'algorithms', ARRAY['javascript', 'arrays', 'searching'], 'function binarySearch(arr, target) {\n  // Your code here\n}', 20),
  ('Merge Sort', 'Implement merge sort algorithm', 'medium', 'algorithms', ARRAY['javascript', 'arrays', 'sorting'], 'function mergeSort(arr) {\n  // Your code here\n}', 25),
  ('Build a Counter Component', 'Create React counter with hooks', 'easy', 'react', ARRAY['react', 'hooks'], '// Create a Counter component', 15),
  ('Fetch API Data', 'Fetch and display API data', 'medium', 'react', ARRAY['react', 'api', 'async'], '// Fetch data from API', 20),
  ('CSS Flexbox Layout', 'Create responsive layout with flexbox', 'easy', 'css', ARRAY['css', 'flexbox'], '/* Create flexbox layout */', 10),
  ('CSS Grid Dashboard', 'Build dashboard with CSS Grid', 'medium', 'css', ARRAY['css', 'grid'], '/* Create grid layout */', 20)
ON CONFLICT DO NOTHING;

-- =============================================
-- FUNCTION: Adjust learning path based on performance
-- =============================================
CREATE OR REPLACE FUNCTION adjust_learning_path(
  p_user_id UUID,
  p_roadmap_id INTEGER,
  p_test_score INTEGER,
  p_adjustment_type TEXT
) RETURNS VOID AS $$
DECLARE
  v_current_path JSONB;
  v_performance RECORD;
BEGIN
  -- Get current roadmap
  SELECT ai_generated_path INTO v_current_path
  FROM roadmaps WHERE id = p_roadmap_id AND user_id = p_user_id;
  
  -- Update or insert performance record
  INSERT INTO user_performance (user_id, roadmap_id, avg_test_score, tests_taken, tests_passed, learning_velocity)
  VALUES (p_user_id, p_roadmap_id, p_test_score, 1, CASE WHEN p_test_score >= 70 THEN 1 ELSE 0 END, p_adjustment_type)
  ON CONFLICT (user_id, roadmap_id) DO UPDATE SET
    avg_test_score = (user_performance.avg_test_score * user_performance.tests_taken + p_test_score) / (user_performance.tests_taken + 1),
    tests_taken = user_performance.tests_taken + 1,
    tests_passed = user_performance.tests_passed + CASE WHEN p_test_score >= 70 THEN 1 ELSE 0 END,
    learning_velocity = p_adjustment_type,
    last_assessment_date = NOW(),
    path_adjustments_count = user_performance.path_adjustments_count + 1,
    updated_at = NOW();
    
  -- Log the adjustment
  INSERT INTO path_adjustments (user_id, roadmap_id, adjustment_type, reason, triggered_by)
  VALUES (p_user_id, p_roadmap_id, p_adjustment_type, 
    CASE 
      WHEN p_test_score >= 90 THEN 'Excellent performance - accelerating path'
      WHEN p_test_score >= 70 THEN 'Good performance - maintaining pace'
      ELSE 'Needs improvement - adding remediation'
    END,
    'test_result');
END;
$$ LANGUAGE plpgsql;
