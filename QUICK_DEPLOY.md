# 🚀 QUICK DEPLOYMENT GUIDE

## ✅ Prerequisites Completed:
- ✅ Code committed to git
- ✅ GitHub repository created
- ⏳ Code needs to be pushed (do this first!)

---

## STEP 1: Push Code to GitHub

Run this command:
```bash
git push -u origin main
```

**If it asks for credentials:**
1. Go to: https://github.com/settings/tokens/new
2. Name it: `deploy-token`
3. Select scope: ✅ **repo** (check this box)
4. Click "Generate token"
5. Copy the token (starts with `ghp_...`)
6. Use it as password when git asks

---

## STEP 2: Get GROQ API Key

1. Go to: https://console.groq.com/keys
2. Sign up/Login
3. Click "Create API Key"
4. Name it: "Truth-Detector"
5. **Copy the key** (starts with `gsk_...`)

You already have NewsAPI key: `99a71cbc53ab4f62b7fed672fb69b47c`

---

## STEP 3: Deploy Database (Neon - 2 minutes)

1. Go to: https://console.neon.tech/signup
2. Sign up (use GitHub for quick signup)
3. Click "Create a project"
   - Name: `truth-detector-db`
   - Region: Choose closest to you
4. Click on the project
5. Click "Connection Details"
6. **Copy the connection string** (starts with `postgresql://...`)
7. Keep this tab open!

---

## STEP 4: Deploy Backend (Render - 3 minutes)

1. Go to: https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Click "Build and deploy from a Git repository"
4. Click "Connect account" → Select GitHub
5. Find and select: **AI-News-Fact-Checker**
6. Click "Connect"

**Configuration:**
- **Name**: `truth-detector-api`
- **Region**: Same as your Neon database
- **Branch**: `main`
- **Root Directory**: (leave blank)
- **Build Command**:
  ```
  cd artifacts/api-server && pnpm install && pnpm run build
  ```
- **Start Command**:
  ```
  cd artifacts/api-server && pnpm run start
  ```

**Environment Variables** (click "Add Environment Variable"):
```
DATABASE_URL = <paste Neon connection string from Step 3>
GROQ_API_KEY = <paste your Groq key from Step 2>
NEWS_API_KEY = 99a71cbc53ab4f62b7fed672fb69b47c
NODE_ENV = production
PORT = 3000
```

7. Click "Create Web Service"
8. **Wait 5-10 minutes** for deployment
9. **Copy the deployment URL** (e.g., `https://truth-detector-api.onrender.com`)

---

## STEP 5: Deploy Frontend (Vercel - 2 minutes)

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Find **AI-News-Fact-Checker** and click "Import"

**Project Configuration:**
- **Framework Preset**: Other
- **Build Command**:
  ```
  PORT=5173 BASE_PATH=/ pnpm run build
  ```
- **Output Directory**:
  ```
  artifacts/fact-checker/dist/public
  ```
- **Install Command**:
  ```
  pnpm install
  ```

**Environment Variables:**
Add these three variables:
```
VITE_API_URL = <paste your Render backend URL from Step 4>
PORT = 5173
BASE_PATH = /
```

4. Click "Deploy"
5. **Wait 2-3 minutes**
6. Click on the deployment URL when ready!

---

## STEP 6: Run Database Migration

After backend is deployed:

1. Go to your Render dashboard
2. Click on "truth-detector-api"
3. Go to "Shell" tab
4. Run this command:
   ```bash
   cd artifacts/api-server && pnpm run push
   ```

---

## 🎉 YOU'RE DONE!

**Your app is live at:**
- Frontend: Your Vercel URL (e.g., `https://truth-detector.vercel.app`)
- Backend: Your Render URL (e.g., `https://truth-detector-api.onrender.com`)

**Test it:**
1. Visit your Vercel URL
2. Paste a news article or claim
3. Click "Analyze"
4. See the magic happen with clickable source links!

---

## 🐛 Troubleshooting

**Frontend can't connect to backend?**
- Check `VITE_API_URL` in Vercel settings
- Make sure Render backend is running (not sleeping)
- Check CORS in backend (should allow all origins in production)

**Database errors?**
- Verify `DATABASE_URL` is correct in Render
- Make sure you ran the migration command
- Check Neon database is active

**API errors?**
- Verify `GROQ_API_KEY` is set correctly
- Check `NEWS_API_KEY` is working
- Look at Render logs for errors

---

## 📞 Need Help?

Check the logs:
- **Frontend**: Vercel deployment logs
- **Backend**: Render logs tab
- **Database**: Neon console

---

## 🔗 Useful Links

- GitHub Repo: https://github.com/zunnoonwaheed/AI-News-Fact-Checker
- Vercel Dashboard: https://vercel.com/dashboard
- Render Dashboard: https://dashboard.render.com
- Neon Console: https://console.neon.tech
- Groq Console: https://console.groq.com

---

Made with ❤️ using Claude Code
