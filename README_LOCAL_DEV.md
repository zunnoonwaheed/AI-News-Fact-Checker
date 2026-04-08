# 🛠️ Local Development Guide

## Quick Start - Run Locally

### Start Backend API

```bash
cd artifacts/api-server
source ../../.env  # Load environment variables
pnpm run dev
```

Backend will run at: http://localhost:3000

### Start Frontend

In a new terminal:

```bash
cd artifacts/fact-checker
export VITE_API_URL=http://localhost:3000
PORT=5173 BASE_PATH=/ pnpm run dev
```

Frontend will run at: http://localhost:5173

---

## Environment Variables

All environment variables are stored in `.env` at the project root:

```bash
# Backend
DATABASE_URL=postgresql://localhost:5432/factcheck_news
GROQ_API_KEY=your_groq_api_key_here
NEWS_API_KEY=your_news_api_key_here
NODE_ENV=development
PORT=3000

# Frontend
VITE_API_URL=http://localhost:3000
PORT=5173
BASE_PATH=/
```

**Note**: The actual API keys are already configured in your `.env` file.

---

## Database Management

### Run Migrations

```bash
export DATABASE_URL=postgresql://localhost:5432/factcheck_news
cd lib/db
pnpm run push
```

### Reset Database

```bash
dropdb factcheck_news
createdb factcheck_news
cd lib/db
pnpm run push
```

### Check Database Connection

```bash
psql factcheck_news
# Inside psql:
\dt  # List tables
\q   # Quit
```

---

## Build Commands

### Build Backend

```bash
cd artifacts/api-server
pnpm run build
```

Output: `artifacts/api-server/dist/`

### Build Frontend

```bash
cd artifacts/fact-checker
PORT=5173 BASE_PATH=/ pnpm run build
```

Output: `artifacts/fact-checker/dist/public/`

---

## Common Commands

```bash
# Install dependencies
pnpm install

# Type check
pnpm run typecheck

# Build all
pnpm run build

# Run tests (if available)
cd artifacts/api-server && pnpm test
```

---

## Troubleshooting

### PostgreSQL not running?

```bash
# Check status
pg_isready

# Start PostgreSQL
brew services start postgresql@14
# OR
pg_ctl -D /usr/local/var/postgres start
```

### Port already in use?

```bash
# Find process on port 3000
lsof -ti:3000

# Kill process
lsof -ti:3000 | xargs kill -9

# Or for port 5173
lsof -ti:5173 | xargs kill -9
```

### Dependencies issues?

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## Project Structure

```
Truth-Detector/
├── artifacts/
│   ├── api-server/      # Backend Express API
│   │   ├── src/
│   │   ├── api/         # Vercel serverless functions
│   │   ├── dist/        # Build output
│   │   └── package.json
│   └── fact-checker/    # Frontend React app
│       ├── src/
│       ├── dist/        # Build output
│       └── package.json
├── lib/
│   ├── db/             # Database schema & migrations
│   └── api-zod/        # API validation schemas
├── .env                # Environment variables
└── pnpm-workspace.yaml # Workspace config
```

---

## API Endpoints (Local)

- `GET  /api/health` - Health check
- `POST /api/analyze` - Analyze news article
- `GET  /api/history` - Get analysis history

Test with:

```bash
# Health check
curl http://localhost:3000/api/health

# Analyze article
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"content": "Your news article text here"}'
```

---

## Tips

- Use `pnpm` for all package management (enforced by preinstall hook)
- Always run migrations after pulling schema changes
- Backend hot-reloads on save in dev mode
- Frontend uses Vite for instant HMR
- Check logs in terminal if something breaks

---

Happy coding! 🚀
