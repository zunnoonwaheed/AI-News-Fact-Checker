# Deployment Guide for Truth-Detector

## Architecture

This application consists of:
- **Frontend**: React + Vite app (`artifacts/fact-checker`)
- **Backend**: Express API server (`artifacts/api-server`)
- **Database**: PostgreSQL

## Deployment Options

### Option 1: Vercel (Frontend) + Render/Railway (Backend) - RECOMMENDED

#### Step 1: Deploy Backend to Render or Railway

1. **Create a new Web Service** on [Render](https://render.com) or [Railway](https://railway.app)
2. Connect your GitHub repository
3. Set build command: `cd artifacts/api-server && pnpm install && pnpm run build`
4. Set start command: `cd artifacts/api-server && pnpm run start`
5. Add environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `GROQ_API_KEY` - Your Groq API key
   - `NEWS_API_KEY` - Your NewsAPI key
   - `NODE_ENV=production`
   - `PORT=3000`

#### Step 2: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - Build Command: `pnpm run build`
   - Output Directory: `artifacts/fact-checker/dist`
   - Install Command: `pnpm install`
4. Add environment variables:
   - `VITE_API_URL` - Your backend URL from Step 1
5. Deploy!

#### Step 3: Set up Database

Use one of these PostgreSQL hosting services:
- [Neon](https://neon.tech) - Free tier available
- [Supabase](https://supabase.com) - Free tier available
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Railway Postgres](https://railway.app)

### Option 2: All-in-One Deployment on Render/Railway

Deploy both frontend and backend as a monorepo:
1. Create a new Web Service
2. Set build command: `pnpm install && pnpm run build`
3. Set start command: `pnpm run start` (you'll need to add this script)
4. Add all environment variables
5. Configure static files to serve from `artifacts/fact-checker/dist`

## Required Environment Variables

### Backend (.env in artifacts/api-server)
```
DATABASE_URL=postgresql://user:password@host:5432/database
GROQ_API_KEY=your_groq_api_key
NEWS_API_KEY=your_news_api_key
NODE_ENV=production
PORT=3000
```

### Frontend
```
VITE_API_URL=https://your-backend-url.com
```

## Database Setup

After deploying your database:

1. Get your PostgreSQL connection string
2. Run migrations:
   ```bash
   pnpm run push
   ```

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Database is connected and migrations are run
- [ ] Frontend can communicate with backend
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] API keys are working (test a fact-check)

## Monitoring

- Check server logs in your hosting platform dashboard
- Monitor API response times
- Set up error tracking (optional: Sentry, LogRocket)

## Troubleshooting

**Frontend can't reach backend:**
- Check CORS configuration in `artifacts/api-server/src/index.ts`
- Verify `VITE_API_URL` is set correctly
- Check network tab in browser dev tools

**Database connection errors:**
- Verify `DATABASE_URL` format
- Ensure database allows external connections
- Check SSL requirements

**API errors:**
- Verify all API keys are set
- Check rate limits on NewsAPI and Groq
- Review server logs for detailed errors
