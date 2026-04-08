# Truth-Detector - AI-Powered News Fact-Checking Platform

A comprehensive fact-checking platform that uses AI to analyze news articles and claims, verifying them against multiple credible sources with detailed claim-by-claim analysis and clickable source links.

## Features

- **AI-Powered Analysis**: Uses Groq LLM to intelligently fact-check claims
- **Multi-Source Verification**: Pulls from NewsAPI to verify against credible news sources
- **Claim-by-Claim Breakdown**: Extracts and analyzes individual claims with verdicts:
  - ✅ Verified
  - ❌ False
  - ⚠️ Misleading
  - 📊 Partially True
  - ❓ Unverified
- **Clickable Source Links**: 2-3 article links per claim for easy verification
- **Credibility Scoring**: 0-100 score based on source quality and verification
- **Professional UI**: Beautiful violet/purple gradient design with responsive layout
- **History Tracking**: View past fact-checks with filtering
- **Statistics Dashboard**: Track verification metrics

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- TailwindCSS
- Radix UI Components
- TanStack Query
- Wouter (routing)

### Backend
- Express.js
- Drizzle ORM
- PostgreSQL
- Groq AI API
- NewsAPI

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL
- Groq API key
- NewsAPI key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zunnoonwaheed/Truth-Detector.git
cd Truth-Detector
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Create PostgreSQL database:
```bash
createdb factcheck_news
```

5. Run database migrations:
```bash
export DATABASE_URL=postgresql://localhost:5432/factcheck_news
pnpm run push
```

### Development

Run both frontend and backend in development mode:

**Terminal 1 - Backend:**
```bash
export DATABASE_URL=postgresql://localhost:5432/factcheck_news
export GROQ_API_KEY='your_groq_api_key'
export NEWS_API_KEY='your_news_api_key'
export NODE_ENV=development
export PORT=3000
cd artifacts/api-server && pnpm run dev
```

**Terminal 2 - Frontend:**
```bash
export PORT=5173
export BASE_PATH="/"
cd artifacts/fact-checker && pnpm run dev
```

Access the app at: http://localhost:5173

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment Options

**Option 1: Vercel (Frontend) + Render (Backend)**
1. Deploy backend to [Render](https://render.com)
2. Deploy frontend to [Vercel](https://vercel.com)
3. Set `VITE_API_URL` environment variable in Vercel

**Option 2: All-in-One on Railway**
1. Deploy to [Railway](https://railway.app)
2. Add PostgreSQL database
3. Configure environment variables
4. Deploy!

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `GROQ_API_KEY` - Groq AI API key
- `NEWS_API_KEY` - NewsAPI key
- `NODE_ENV` - development/production
- `PORT` - Server port (default: 3000)

### Frontend
- `VITE_API_URL` - Backend API URL (production only)
- `PORT` - Dev server port (default: 5173)
- `BASE_PATH` - Base path for routing (default: /)

## Project Structure

```
Truth-Detector/
├── artifacts/
│   ├── api-server/          # Express backend
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   └── lib/
│   │   └── package.json
│   └── fact-checker/        # React frontend
│       ├── src/
│       │   ├── pages/
│       │   ├── components/
│       │   └── main.tsx
│       └── package.json
├── lib/
│   ├── api-client-react/    # API client library
│   ├── api-zod/             # Zod schemas
│   └── db/                  # Database models
├── vercel.json              # Vercel config
├── DEPLOYMENT.md            # Deployment guide
└── package.json
```

## API Endpoints

- `POST /api/factcheck` - Submit a claim/article for fact-checking
- `GET /api/factcheck/:id` - Get fact-check result by ID
- `GET /api/factcheck/history` - Get fact-check history
- `GET /api/factcheck/stats` - Get statistics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Credits

Built with [Claude Code](https://claude.com/claude-code)

---

Made with ❤️ by [Zunnoon Waheed](https://github.com/zunnoonwaheed)
