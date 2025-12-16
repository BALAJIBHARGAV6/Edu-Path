-- Debug: Check what's in the database for a specific user
-- Replace 'YOUR_USER_ID' with the actual user ID

-- 1. Check user_profiles table
SELECT * FROM user_profiles WHERE id = 'cb21466e-2b9b-4427-9bd3-f9e248fcc8ab';

-- 2. Check user_skills table
SELECT * FROM user_skills WHERE user_id = 'cb21466e-2b9b-4427-9bd3-f9e248fcc8ab';

-- 3. Check roadmaps table
SELECT * FROM roadmaps WHERE user_id = 'cb21466e-2b9b-4427-9bd3-f9e248fcc8ab';

-- 4. Verify user_skills table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_skills';

-- 5. Count skills for this user
SELECT COUNT(*) as skill_count FROM user_skills WHERE user_id = 'cb21466e-2b9b-4427-9bd3-f9e248fcc8ab';

-- 6. Check actual columns in user_skills table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_skills'
ORDER BY ordinal_position;
