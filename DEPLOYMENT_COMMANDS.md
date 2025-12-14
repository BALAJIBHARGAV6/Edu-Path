# Deployment Commands & Configuration

## Issues Fixed ✅

### 1. Onboarding Redirect Issue
**Problem**: Existing users were always redirected to onboarding instead of dashboard.

**Solution**: 
- Updated [auth/login/page.tsx](frontend/src/app/auth/login/page.tsx) to check Supabase directly for existing roadmap
- Updated [dashboard/page.tsx](frontend/src/app/dashboard/page.tsx) to load roadmap from Supabase on mount
- Now properly checks database instead of relying on potentially stale client-side state

### 2. API URL Configuration
**Problem**: Frontend was using `http://localhost:5000` instead of Render deployment.

**Solution**: Updated [.env.local](frontend/.env.local) to use `https://edu-path.onrender.com`

---

## Vercel Deployment (Frontend)

### Step 1: Link Your Project
```bash
cd "c:/E-Learning Platform/frontend"
vercel link
```
Follow the prompts to link to your existing Vercel project.

### Step 2: Update Environment Variables
```bash
# Set the backend API URL to point to your Render deployment
vercel env add NEXT_PUBLIC_API_URL production
# When prompted, enter: https://edu-path.onrender.com

# Set Supabase URL
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# When prompted, enter: https://etgpsnzogfplivuvqznm.supabase.co

# Set Supabase Anon Key
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# When prompted, paste your anon key
```

### Step 3: Deploy
```bash
vercel --prod
```

### Alternative: Update via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update `NEXT_PUBLIC_API_URL` to: `https://edu-path.onrender.com`
5. Ensure other variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://etgpsnzogfplivuvqznm.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (your key from .env)
6. Go to **Deployments** → Click ⋯ → **Redeploy**

---

## Render Deployment (Backend)

### Option 1: Via Render Dashboard
1. Go to https://dashboard.render.com/
2. Select your **edu-path** service
3. Go to **Environment** tab
4. Verify these variables are set:
   ```
   PORT=5000
   NODE_ENV=production
   SUPABASE_URL=https://etgpsnzogfplivuvqznm.supabase.co
   SUPABASE_ANON_KEY=(your anon key)
   SUPABASE_SERVICE_ROLE_KEY=(your service role key)
   GROQ_API_KEY=(your Groq API key)
   FRONTEND_URL=(your Vercel URL, e.g., https://your-app.vercel.app)
   ```
5. Go to **Logs** tab to check for any errors
6. Click **Manual Deploy** → **Deploy latest commit** if needed

### Option 2: Install Render CLI (Recommended)
```bash
# Install Render CLI
npm install -g @render-tools/cli

# Login to Render
render login

# Check service status
render services list

# View logs
render services logs edu-path --tail

# Trigger deployment
render services deploy edu-path
```

### Check Render Service Health
```bash
# Test your Render backend directly
curl https://edu-path.onrender.com/health

# Test roadmap generation endpoint
curl -X POST "https://edu-path.onrender.com/api/roadmap/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "careerGoal": "Frontend Developer",
    "experienceLevel": "beginner",
    "learningStyle": "visual",
    "hoursPerWeek": 10
  }'
```

---

## Quick Commands Summary

### Vercel (Frontend)
```bash
# Navigate to frontend
cd "c:/E-Learning Platform/frontend"

# Link project (first time only)
vercel link

# Check environment variables
vercel env ls

# Pull environment variables
vercel env pull .env.local

# Deploy to production
vercel --prod

# Check deployment status
vercel ls
```

### Test API Connection
```bash
# From your local frontend, test the connection
curl https://edu-path.onrender.com/api/roadmap/generate \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","careerGoal":"Developer","experienceLevel":"beginner","learningStyle":"visual","hoursPerWeek":10}'
```

---

## Troubleshooting

### Issue: Roadmap generation still fails
1. Check Render logs: https://dashboard.render.com/
2. Verify GROQ_API_KEY is set in Render environment
3. Ensure Render service is not in "suspended" state (happens after 15min inactivity on free tier)

### Issue: CORS errors
1. Update `FRONTEND_URL` in Render environment to match your Vercel URL
2. Redeploy the backend

### Issue: 404 errors on API calls
1. Verify `NEXT_PUBLIC_API_URL` in Vercel is set to `https://edu-path.onrender.com`
2. Ensure NO trailing slash in the URL
3. Redeploy frontend

---

## Next Steps

1. **Rebuild frontend** to apply .env changes:
   ```bash
   cd "c:/E-Learning Platform/frontend"
   npm run build
   ```

2. **Test locally** with new environment:
   ```bash
   npm run dev
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

4. **Monitor Render logs** for any backend errors

5. **Test the complete flow**:
   - Sign up → Onboarding → Roadmap generation → Dashboard
   - Login as existing user → Should go directly to dashboard
