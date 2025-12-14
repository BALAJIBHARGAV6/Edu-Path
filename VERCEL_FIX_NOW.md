# 🚨 URGENT: Fix Double Slash Bug in Vercel

## The Problem
Your error shows: `https://edu-path.onrender.com//api/roadmap/generate`

Notice the **double slash** (`//api`)? This means your Vercel environment variable has a trailing slash!

## ⚡ Quick Fix (2 minutes)

### Step 1: Update Vercel Environment Variable
1. Go to: https://vercel.com/balaji-bhargavs-projects/edu-path-learn/settings/environment-variables
2. Find `NEXT_PUBLIC_API_URL`
3. **Delete** any existing value
4. **Add new value** (copy this exactly, NO trailing slash):
   ```
   https://edu-path.onrender.com
   ```
5. Make sure it applies to **Production**, **Preview**, and **Development**
6. Click **Save**

### Step 2: Redeploy
1. Go to: https://vercel.com/balaji-bhargavs-projects/edu-path-learn/deployments
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. Wait ~1-2 minutes

### Step 3: Also Update Render (for CORS)
1. Go to: https://dashboard.render.com/
2. Select your **edu-path** backend service
3. Go to **Environment** tab
4. Update `FRONTEND_URL` to:
   ```
   https://edu-path-learn.vercel.app
   ```
5. Click **Save Changes** (auto-redeploys in ~2-3 min)

---

## 🎯 What to Check

**CORRECT URL (NO trailing slash):**
```
✅ https://edu-path.onrender.com
```

**WRONG URLs (will cause double slash):**
```
❌ https://edu-path.onrender.com/
❌ http://localhost:5000/
❌ https://edu-path.onrender.com//
```

---

## 🧪 Test After Changes

Once both Vercel and Render have redeployed (~3-4 minutes total):

1. Go to your Vercel app: https://edu-path-learn.vercel.app
2. Try the onboarding flow
3. Generate a roadmap
4. Should work perfectly! ✅

---

## ⏱️ Timeline
1. **Update Vercel env var**: 30 seconds
2. **Redeploy Vercel**: 1-2 minutes
3. **Update Render env var**: 30 seconds  
4. **Render auto-redeploy**: 2-3 minutes
5. **Total**: ~4-5 minutes

After this, both CORS and the double slash will be fixed! 🎉
