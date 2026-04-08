# 🎉 Deployment Status

## ✅ Frontend Deployed!

**Your frontend is LIVE at:**
https://truth-detector-gamma.vercel.app

The frontend has been successfully deployed to Vercel!

---

## 📋 Backend Deployment - Via Vercel Dashboard

Since the backend uses a monorepo structure with workspace dependencies, it needs to be deployed via the Vercel dashboard. Follow these simple steps:

### Step 1: Deploy Backend via Vercel Dashboard

1. Go to: **https://vercel.com/new**
2. Click "Import" next to your **AI-News-Fact-Checker** repository
3. Configure the project:

**Project Settings:**
- **Project Name**: `truth-detector-api`
- **Framework Preset**: Other
- **Root Directory**: Click "Edit" → Select `artifacts/api-server`
- **Node.js Version**: 20.x
- **Build Command**: `cd ../.. && pnpm install && cd artifacts/api-server && pnpm run build && cp -r dist .vercel/output/ && cp package.json .vercel/output/`
- **Output Directory**: Leave empty
- **Install Command**: Leave empty (handled in build command)

**Environment Variables** (Add these):
```
DATABASE_URL = <your database URL>
GROQ_API_KEY = <your GROQ API key>
NEWS_API_KEY = 99a71cbc53ab4f62b7fed672fb69b47c
NODE_ENV = production
PORT = 3000
```

4. Click **Deploy**
5. Wait 2-3 minutes
6. **Copy the backend URL** (e.g., `https://truth-detector-api.vercel.app`)

---

### Step 2: Get Required API Keys

#### GROQ API Key:
1. Go to: https://console.groq.com/keys
2. Sign up/Login
3. Click "Create API Key"
4. Name it: "Truth-Detector"
5. Copy the key (starts with `gsk_...`)

#### Database (Choose One):

**Option A - Vercel Postgres (Recommended):**
1. Go to your backend project on Vercel
2. Click "Storage" tab
3. Click "Create Database" → "Postgres"
4. Copy the `POSTGRES_URL` from the .env.local tab
5. Add it as `DATABASE_URL` environment variable

**Option B - Neon (Free):**
1. Go to: https://console.neon.tech/signup
2. Sign up (use GitHub for quick signup)
3. Create a new project: `truth-detector-db`
4. Copy the connection string
5. Add it as `DATABASE_URL` environment variable

---

### Step 3: Update Frontend with Backend URL

1. Go to your frontend project on Vercel: https://vercel.com/zunnoonwaheed-gmailcoms-projects/truth-detector
2. Click "Settings" → "Environment Variables"
3. Add or update:
   ```
   VITE_API_URL = <your backend URL from Step 1>
   ```
4. Go to "Deployments" → Click "..." on latest → "Redeploy"

---

### Step 4: Run Database Migration

After backend is deployed with database configured:

**Via Vercel Dashboard:**
1. Go to your backend project
2. Click "Settings" → "Functions"
3. Or run locally:
   ```bash
   export DATABASE_URL="your_database_url"
   cd artifacts/api-server
   pnpm run push
   ```

---

## 🧪 Test Your Deployment

1. Visit: **https://truth-detector-gamma.vercel.app**
2. Paste a news claim or article
3. Click "Analyze"
4. Verify fact-checking works!

---

## 🔗 Your Project URLs

- **Frontend**: https://truth-detector-gamma.vercel.app
- **Backend**: (Deploy via dashboard - Step 1)
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/zunnoonwaheed/AI-News-Fact-Checker

---

## 🐛 Troubleshooting

**Frontend can't connect to backend?**
- Make sure `VITE_API_URL` is set in frontend environment variables
- Verify backend is deployed and running
- Check backend URL doesn't have trailing slash

**Database connection errors?**
- Verify `DATABASE_URL` is correct in backend
- Run database migration command
- Check database is active

**Build errors?**
- Check all environment variables are set
- Verify Node.js version is 20.x
- Check build logs in Vercel dashboard

---

Made with 🤖 by Claude Code
