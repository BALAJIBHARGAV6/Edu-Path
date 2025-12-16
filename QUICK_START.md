# 🚀 QUICK START - Run This First!

## Step 1: Run Database Migration (CRITICAL!)
You MUST run this SQL in Supabase before testing:

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New query"
5. Copy the ENTIRE content from: `supabase/migration_fix_schema.sql`
6. Paste into SQL Editor
7. Click "Run" or press Ctrl+Enter
8. Wait for "Success. No rows returned" message

---

## Step 2: Wait for Deployments

### Backend (Render)
- Status: Check at https://dashboard.render.com
- Look for: "Deploy succeeded" message
- Usually takes: 2-3 minutes

### Frontend (Vercel)  
- Status: Check at https://vercel.com/dashboard
- Look for: "Ready" status with green checkmark
- Usually takes: 1-2 minutes

---

## Step 3: Test Onboarding Flow

1. Open your app (e.g., https://your-app.vercel.app)
2. Go to `/onboarding` page
3. You should see:
   - ✅ Empty form (NOT previous user's data)
   - ✅ All fields blank/default values
   
4. Fill out the form:
   - Step 1: Enter your name + select career goal
   - Step 2: Select experience level
   - Step 3: Select 3-5 skills
   - Step 4: Choose learning style
   - Step 5: Set hours per week
   
5. Click "Complete Onboarding"
6. Should redirect to dashboard

---

## Step 4: Verify Everything Works

### Check Settings Page
- Go to `/settings`
- Should show your name correctly
- Should show all skills you selected
- Try adding/removing a skill - should save immediately

### Check Videos Page
- Go to `/videos`
- Should show ONLY videos for your skills
- No dummy data

### Check Practice Page
- Go to `/practice`
- Should show ONLY challenges for your skills
- No dummy data

### Check Dashboard
- Go to `/dashboard`
- Should show real streak and XP (not 0 or dummy values)

---

## Troubleshooting

### ❌ Still getting 500 error?
→ Migration SQL not run yet. Go back to Step 1.

### ❌ Onboarding still showing old data?
→ Clear browser cache or use incognito mode.

### ❌ Skills not appearing?
→ Check browser console (F12) for errors. Look for "[PROFILE_SAVE]" logs.

### ❌ Videos/Practice pages empty?
→ Make sure you selected skills in onboarding. Go to Settings to add skills.

---

## What Got Fixed

1. ✅ Onboarding shows fresh form (not cached data)
2. ✅ Profile saves without 500 errors
3. ✅ Skills stored in proper database table
4. ✅ Videos show only user's skills
5. ✅ Practice shows only user's skills
6. ✅ Dashboard shows real stats
7. ✅ Settings manages skills properly

---

## Important Files

- **Migration SQL:** `supabase/migration_fix_schema.sql` ← RUN THIS FIRST!
- **Full Documentation:** `FIXES_COMPLETED.md`
- **Onboarding Code:** `frontend/src/app/onboarding/page.tsx`
- **Backend API:** `backend/src/routes/users.ts`

---

## Need Help?

Check these logs:

**Browser Console (F12):**
- Look for `[PROFILE_SAVE]` messages
- Check for red error messages

**Backend Logs (Render):**
- Go to dashboard → Your service → Logs tab
- Look for error messages

**Database (Supabase):**
- SQL Editor → Table Editor
- Check `user_profiles` and `user_skills` tables
- Verify your data is there

---

🎉 **Everything is ready!** Just run the migration SQL and test!
