# 🚀 Quick Start - Deploy in 5 Minutes!

## Option 1: Automated Script (Recommended)

Run the automated deployment script:

```bash
./complete-deployment.sh
```

This script will guide you through:
1. Setting up a cloud database (Neon or Vercel Postgres)
2. Configuring backend build settings
3. Deploying backend and frontend
4. Testing your application

---

## Option 2: Manual Deployment (Step-by-Step)

### 1. Create Database (2 min)

**Neon (Free):**
- Go to: https://console.neon.tech/signup
- Create project: `truth-detector-db`
- Copy connection string

**OR Vercel Postgres:**
- Go to backend project → Storage → Create Postgres
- Copy `POSTGRES_URL`

### 2. Update Database URL

```bash
cd artifacts/api-server
# Paste your database URL when prompted:
vercel env add DATABASE_URL production
```

### 3. Configure Backend Settings

Go to: https://vercel.com/zunnoonwaheed-gmailcoms-projects/ai-news-fact-checker-api-server/settings

Set:
- **Root Directory**: `artifacts/api-server`
- **Build Command**: `cd ../.. && pnpm install && cd artifacts/api-server && pnpm run build`
- **Install Command**: (empty)

### 4. Deploy Backend

- Go to Deployments tab
- Click "Redeploy"
- Copy the deployment URL

### 5. Update Frontend

```bash
cd ../../  # Back to root
# Paste your backend URL when prompted:
vercel env add VITE_API_URL production
```

Go to: https://vercel.com/zunnoonwaheed-gmailcoms-projects/truth-detector/deployments
- Click "Redeploy"

---

## ✅ Done!

Your app is live at:
- **Frontend**: https://truth-detector-gamma.vercel.app
- **Backend**: [Your deployment URL]

---

## 📋 Already Configured

✅ Local development environment
✅ PostgreSQL database (local)
✅ Environment variables (GROQ_API_KEY, NEWS_API_KEY)
✅ Vercel projects created
✅ Git repository connected

---

## 🆘 Need Help?

See `DEPLOYMENT_INSTRUCTIONS.md` for detailed troubleshooting and documentation.

---

**Estimated Total Time**: 5-10 minutes
