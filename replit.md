# FactCheck News — Workspace

## Overview

A full-stack news fact-checking application. Users paste a news headline, claim, or article text; the backend fetches related news via NewsAPI and runs a thorough analysis with Claude AI (Anthropic), then returns a structured verdict with source citations, claim-by-claim breakdown, and a credibility score.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **AI**: Anthropic Claude (claude-opus-4-5)
- **News data**: NewsAPI.org

## Key Secrets Required

- `ANTHROPIC_API_KEY` — Claude AI API key for fact-checking analysis
- `NEWS_API_KEY` — NewsAPI.org key for fetching related articles
- `DATABASE_URL` — PostgreSQL connection (auto-provisioned by Replit)

## Architecture

```
artifacts/
  fact-checker/      # React + Vite frontend
  api-server/        # Express 5 backend
    src/
      routes/
        factcheck.ts # POST /api/factcheck, GET /api/factcheck/history|stats|:id
      lib/
        factcheck.ts # NewsAPI + Anthropic integration logic
lib/
  api-spec/          # OpenAPI spec (source of truth)
  api-client-react/  # Generated React Query hooks
  api-zod/           # Generated Zod schemas
  db/                # Drizzle schema + client
    src/schema/
      factchecks.ts  # fact_checks table
```

## Pages

- `/` — Home: paste a claim, submit, see recent checks
- `/history` — Browse all fact checks, filter by verdict
- `/stats` — Aggregate statistics dashboard
- `/result/:id` — Detailed result: claims, sources, AI analysis

## Verdict Types

- `verified` — Accurate and well-supported
- `false` — Factually incorrect
- `misleading` — Contains truth but deceptive
- `partially_true` — Some accurate, some not
- `unverified` — Cannot confirm or deny

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm run typecheck:libs` — rebuild TypeScript declaration files for shared libs
