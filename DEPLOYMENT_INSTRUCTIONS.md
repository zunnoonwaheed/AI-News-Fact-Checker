# Complete Deployment Instructions

## ✅ What's Already Done:

1. **Local Environment**: Fully set up with PostgreSQL
2. **Vercel Projects**: Created and configured
   - Frontend: `truth-detector`
   - Backend: `ai-news-fact-checker-api-server`
3. **Environment Variables Set**:
   - GROQ_API_KEY: ✅ Configured
   - NEWS_API_KEY: ✅ Configured
   - NODE_ENV: ✅ Configured
   - DATABASE_URL: ⚠️ Placeholder (needs real database)

---

## 🚀 Complete the Deployment (3 Simple Steps):

### Step 1: Create Cloud Database (2 minutes)

**Option A - Neon (Recommended, Free):**
1. Go to: https://console.neon.tech/signup
2. Sign up with GitHub (instant)
3. Create project: `truth-detector-db`
4. Copy the connection string (starts with `postgresql://`)

**Option B - Vercel Postgres:**
1. Go to: https://vercel.com/zunnoonwaheed-gmailcoms-projects/ai-news-fact-checker-api-server
2. Click "Storage" → "Create Database" → "Postgres"
3. Copy the `POSTGRES_URL` from .env.local tab

---

### Step 2: Update Backend Database URL

1. Go to: https://vercel.com/zunnoonwaheed-gmailcoms-projects/ai-news-fact-checker-api-server/settings/environment-variables

2. Find `DATABASE_URL` and click "Edit"

3. Replace the placeholder with your actual database URL from Step 1

4. Click "Save"

---

### Step 3: Configure & Deploy Backend

1. Go to: https://vercel.com/zunnoonwaheed-gmailcoms-projects/ai-news-fact-checker-api-server/settings

2. Click "General" → Scroll to "Build & Development Settings"

3. Set these values:
   ```
   Root Directory: artifacts/api-server
   Build Command: cd ../.. && pnpm install && cd artifacts/api-server && pnpm run build
   Install Command: (leave empty)
   Output Directory: (leave empty)
   ```

4. Click "Save"

5. Go to "Deployments" tab

6. Click "..." on any deployment → "Redeploy"

7. **Copy the deployment URL** (e.g., `https://ai-news-fact-checker-api-server.vercel.app`)

---

### Step 4: Update Frontend with Backend URL

1. Go to: https://vercel.com/zunnoonwaheed-gmailcoms-projects/truth-detector/settings/environment-variables

2. Add new variable:
   ```
   Name: VITE_API_URL
   Value: <paste backend URL from Step 3>
   Environment: Production
   ```

3. Click "Save"

4. Go to "Deployments" tab → Click "Redeploy"

---

## 🎉 You're Done!

Your app will be live at:
- **Frontend**: https://truth-detector-gamma.vercel.app
- **Backend**: https://ai-news-fact-checker-api-server.vercel.app

Test by pasting a news article and clicking "Analyze"!

---

## 📝 Quick Reference

**API Keys Already Configured:**
- GROQ_API_KEY: ✅ Configured in Vercel
- NEWS_API_KEY: ✅ Configured in Vercel

**Useful Links:**
- Backend Project: https://vercel.com/zunnoonwaheed-gmailcoms-projects/ai-news-fact-checker-api-server
- Frontend Project: https://vercel.com/zunnoonwaheed-gmailcoms-projects/truth-detector
- Neon Database: https://console.neon.tech
- GROQ Console: https://console.groq.com/keys

---

## 🐛 Troubleshooting

**Build fails?**
- Check all environment variables are set in Vercel dashboard
- Verify Root Directory is set to `artifacts/api-server`
- Check build command matches exactly

**Frontend can't connect?**
- Verify VITE_API_URL is set correctly
- Check backend URL doesn't have trailing slash
- Verify backend is deployed and running

**Database errors?**
- Verify DATABASE_URL is correct
- Check database is active on Neon/Vercel
- Run migrations if needed (redeploy backend)

---

Made with ❤️ using Claude Code
