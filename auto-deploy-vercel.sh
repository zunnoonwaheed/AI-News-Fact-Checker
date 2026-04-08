#!/bin/bash

# Automated Vercel Deployment Script
# This script deploys both backend and frontend to Vercel

set -e  # Exit on error

echo "🚀 Automated Vercel Deployment"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if logged in to Vercel
echo -e "${BLUE}Checking Vercel authentication...${NC}"
if ! vercel whoami &>/dev/null; then
    echo -e "${RED}Not logged in to Vercel!${NC}"
    echo "Please run: vercel login"
    echo "Then run this script again."
    exit 1
fi

echo -e "${GREEN}✓ Authenticated with Vercel${NC}"
echo ""

# Deploy Backend API
echo -e "${BLUE}Step 1: Deploying Backend API...${NC}"
echo "================================"
cd artifacts/api-server

# Deploy to production
echo "Deploying to Vercel..."
BACKEND_URL=$(vercel --prod --yes 2>&1 | tee /dev/tty | grep -o 'https://[^[:space:]]*' | tail -1)

if [ -z "$BACKEND_URL" ]; then
    echo -e "${RED}Failed to get backend URL${NC}"
    echo "Please check the deployment logs above"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Backend deployed!${NC}"
echo -e "${GREEN}Backend URL: $BACKEND_URL${NC}"
echo ""

# Go back to root
cd ../..

# Deploy Frontend
echo -e "${BLUE}Step 2: Deploying Frontend...${NC}"
echo "================================"

# Set the backend URL as environment variable for frontend
export VITE_API_URL=$BACKEND_URL
export PORT=5173
export BASE_PATH=/
export NODE_ENV=production

# Deploy frontend to production
echo "Deploying frontend with backend URL: $BACKEND_URL"
FRONTEND_URL=$(vercel --prod --yes -e VITE_API_URL=$BACKEND_URL -e PORT=5173 -e BASE_PATH=/ -e NODE_ENV=production 2>&1 | tee /dev/tty | grep -o 'https://[^[:space:]]*' | tail -1)

if [ -z "$FRONTEND_URL" ]; then
    echo -e "${RED}Failed to get frontend URL${NC}"
    echo "Please check the deployment logs above"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Frontend deployed!${NC}"
echo -e "${GREEN}Frontend URL: $FRONTEND_URL${NC}"
echo ""

echo "================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "================================"
echo ""
echo -e "${GREEN}Your App URLs:${NC}"
echo -e "  Frontend: ${BLUE}$FRONTEND_URL${NC}"
echo -e "  Backend:  ${BLUE}$BACKEND_URL${NC}"
echo ""
echo -e "${YELLOW}⚠️  Important: Set these environment variables in Vercel dashboard:${NC}"
echo ""
echo "Backend (go to: https://vercel.com/dashboard):"
echo "  - DATABASE_URL (get from Vercel Postgres or Neon.tech)"
echo "  - GROQ_API_KEY (get from console.groq.com/keys)"
echo "  - NEWS_API_KEY=99a71cbc53ab4f62b7fed672fb69b47c"
echo ""
echo -e "${GREEN}Then redeploy both projects from Vercel dashboard.${NC}"
echo ""
echo -e "${GREEN}✨ Happy fact-checking!${NC}"
