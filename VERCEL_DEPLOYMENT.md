# Deploy to Vercel - Complete Guide

## Step 1: Deploy Backend API

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Find **AI-News-Fact-Checker** and click "Import"

### Backend Configuration:
- **Project Name**: `truth-detector-api` (or any name you prefer)
- **Framework Preset**: Other
- **Root Directory**: Click "Edit" and select `artifacts/api-server`
- **Build Command**: Leave empty (Vercel will use vercel.json)
- **Output Directory**: Leave empty
- **Install Command**: `pnpm install`

### Environment Variables (Click "Add" for each):
```
DATABASE_URL = your_postgresql_connection_string
GROQ_API_KEY = your_groq_api_key
NEWS_API_KEY = 99a71cbc53ab4f62b7fed672fb69b47c
NODE_ENV = production
PORT = 3000
```

**Important**:
- Get GROQ API Key from: https://console.groq.com/keys
- For DATABASE_URL, you can use:
  - Vercel Postgres (recommended): https://vercel.com/docs/storage/vercel-postgres
  - Or Neon: https://console.neon.tech/signup

4. Click "Deploy"
5. Wait 2-3 minutes for deployment
6. **Copy the deployment URL** (e.g., `https://truth-detector-api.vercel.app`)

---

## Step 2: Deploy Frontend

1. Go to https://vercel.com/new again
2. Click "Import Git Repository"
3. Find **AI-News-Fact-Checker** and click "Import"

### Frontend Configuration:
- **Project Name**: `truth-detector` (or any name you prefer)
- **Framework Preset**: Other
- **Root Directory**: Leave as root (don't change)
- **Build Command**: `PORT=5173 BASE_PATH=/ pnpm run build`
- **Output Directory**: `artifacts/fact-checker/dist/public`
- **Install Command**: `pnpm install`

### Environment Variables (Click "Add" for each):
```
VITE_API_URL = <paste your backend URL from Step 1>
PORT = 5173
BASE_PATH = /
NODE_ENV = production
```

4. Click "Deploy"
5. Wait 2-3 minutes
6. Your app is live!

---

## Step 3: Setup Database (If using Vercel Postgres)

1. Go to your backend project dashboard on Vercel
2. Click "Storage" tab
3. Click "Create Database" → "Postgres"
4. Click "Create"
5. Go to ".env.local" tab and copy the `POSTGRES_URL`
6. Go to "Settings" → "Environment Variables"
7. Update `DATABASE_URL` with the new Postgres URL
8. Redeploy the backend

---

## Step 4: Run Database Migration

After backend is deployed and database is configured:

1. Go to your backend project on Vercel
2. Click "Deployments" → Click the latest deployment
3. Click "..." menu → "Redeploy"
4. Or run locally:
   ```bash
   export DATABASE_URL="your_vercel_postgres_url"
   cd artifacts/api-server
   pnpm run push
   ```

---

## Testing Your Deployment

1. Visit your frontend URL (e.g., `https://truth-detector.vercel.app`)
2. Paste a news claim or article
3. Click "Analyze"
4. Verify the fact-checking works!

---

## Troubleshooting

### Frontend can't connect to backend?
- Check `VITE_API_URL` in frontend environment variables
- Make sure it points to your backend URL (without trailing slash)
- Verify backend is deployed and running

### Database connection errors?
- Verify `DATABASE_URL` is set correctly in backend
- Make sure you ran the database migration
- Check Vercel Postgres or Neon database is active

### API Key errors?
- Verify `GROQ_API_KEY` is set correctly
- Test at: https://console.groq.com/keys
- Check `NEWS_API_KEY` is valid

### Need to redeploy?
- Just push to GitHub, Vercel will auto-deploy
- Or use "Redeploy" button in Vercel dashboard

---

## Quick Links

- **GitHub Repo**: https://github.com/zunnoonwaheed/AI-News-Fact-Checker
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GROQ API Keys**: https://console.groq.com/keys
- **Vercel Docs**: https://vercel.com/docs

---

Your AI News Fact-Checker is now deployed on Vercel! 🎉
