# 🚀 Render Environment Update Required

## Issue Fixed ✅
- Added `https://edu-path-learn.vercel.app` to CORS allowlist in backend code
- Pushed to GitHub (commit `45994f1`)

## ⚠️ ACTION REQUIRED: Update Render Environment Variable

### Option 1: Via Render Dashboard (Recommended)
1. Go to https://dashboard.render.com/
2. Select your **edu-path** service
3. Click **Environment** tab
4. Find `FRONTEND_URL` and update to:
   ```
   https://edu-path-learn.vercel.app
   ```
5. Click **Save Changes**
6. Render will automatically redeploy with the new environment variable

### Option 2: Manual Deploy (If needed)
1. After updating environment variable above
2. Go to **Manual Deploy** section
3. Click **Deploy latest commit**
4. Wait for deployment to complete (~2-3 minutes)

---

## 🧪 Test After Deployment

Wait for Render to finish deploying, then test:

```bash
# Test CORS is working
curl -X OPTIONS "https://edu-path.onrender.com/api/roadmap/generate" \
  -H "Origin: https://edu-path-learn.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Look for this in the response:
```
Access-Control-Allow-Origin: https://edu-path-learn.vercel.app
```

---

## ✅ Complete Fix Checklist

- [x] Updated backend CORS code
- [x] Pushed to GitHub
- [ ] **Update `FRONTEND_URL` in Render** ← DO THIS NOW
- [ ] Wait for Render redeploy (~2-3 min)
- [ ] Test your Vercel app - CORS errors should be gone!

---

## Expected Timeline
1. Update Render env var: **30 seconds**
2. Render auto-redeploy: **2-3 minutes**
3. Test on Vercel: **Immediately after**

After this, your roadmap generation will work perfectly! 🎉
