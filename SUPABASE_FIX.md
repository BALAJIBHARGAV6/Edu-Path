# ��� Supabase 400 Error - Quick Fix

## The Problem
Getting 400 Bad Request when querying roadmaps table. This is usually due to:
1. **RLS Policies not set up correctly** in Supabase
2. **Missing authentication context** in queries

## ✅ Quick Fix Steps

### Step 1: Check Supabase RLS Policies

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Table Editor** → **roadmaps** table
4. Click the **shield icon** (RLS) at the top
5. Make sure you have these policies:

**Policy 1: SELECT (read)**
```sql
CREATE POLICY "Users can view own roadmaps" ON roadmaps
  FOR SELECT USING (auth.uid() = user_id);
```

**Policy 2: INSERT/UPDATE/DELETE**
```sql
CREATE POLICY "Users can manage own roadmaps" ON roadmaps
  FOR ALL USING (auth.uid() = user_id);
```

### Step 2: Verify User Auth is Working

Open your browser console on your app and run:
```javascript
const { data } = await supabase.auth.getSession()
console.log('User ID:', data.session?.user?.id)
```

If this returns `null`, the user is not authenticated.

### Step 3: Re-run Schema (if policies missing)

1. Go to Supabase **SQL Editor**
2. Run this:

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own roadmaps" ON roadmaps;
DROP POLICY IF EXISTS "Users can manage own roadmaps" ON roadmaps;

-- Recreate policies
CREATE POLICY "Users can view own roadmaps" ON roadmaps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own roadmaps" ON roadmaps
  FOR ALL USING (auth.uid() = user_id);
```

3. Click **Run**

---

## Alternative: Temporarily Disable RLS (Testing Only!)

**⚠️ Only for testing! Re-enable after!**

```sql
ALTER TABLE roadmaps DISABLE ROW LEVEL SECURITY;
```

If this makes the error go away, then the RLS policies are the issue.

Don't forget to re-enable:
```sql
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
```

---

## Expected Result

After fixing RLS policies:
- ✅ No more 400 errors
- ✅ Users can see their own roadmaps
- ✅ Users redirected correctly based on roadmap existence
