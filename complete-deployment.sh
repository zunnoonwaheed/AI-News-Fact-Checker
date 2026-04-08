#!/bin/bash

echo "🚀 Truth Detector - Complete Deployment Script"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}This script will help you complete the deployment!${NC}"
echo ""

# Step 1: Database Setup
echo -e "${YELLOW}Step 1: Database Setup${NC}"
echo "--------------------------------------"
echo ""
echo "Choose your database option:"
echo "  1) Neon (Free, Recommended)"
echo "  2) Vercel Postgres"
echo "  3) I already have a DATABASE_URL"
echo ""
read -p "Enter choice (1-3): " db_choice

case $db_choice in
  1)
    echo ""
    echo -e "${BLUE}Opening Neon signup...${NC}"
    echo "1. Sign up at: https://console.neon.tech/signup"
    echo "2. Create a project named: truth-detector-db"
    echo "3. Copy the connection string"
    echo ""
    open "https://console.neon.tech/signup" 2>/dev/null || echo "Visit: https://console.neon.tech/signup"
    ;;
  2)
    echo ""
    echo -e "${BLUE}Opening Vercel Storage...${NC}"
    echo "1. Go to Storage tab"
    echo "2. Create Postgres database"
    echo "3. Copy POSTGRES_URL from .env.local"
    echo ""
    open "https://vercel.com/zunnoonwaheed-gmailcoms-projects/ai-news-fact-checker-api-server" 2>/dev/null
    ;;
  3)
    echo ""
    echo "Great! You can enter it in the next step."
    ;;
esac

echo ""
read -p "Enter your DATABASE_URL: " database_url

if [ -z "$database_url" ]; then
    echo -e "${RED}No DATABASE_URL provided. Exiting.${NC}"
    exit 1
fi

# Update Vercel environment variable
echo ""
echo -e "${BLUE}Updating DATABASE_URL in Vercel...${NC}"
cd artifacts/api-server
echo "$database_url" | vercel env add DATABASE_URL production --force 2>/dev/null || \
  (vercel env rm DATABASE_URL production -y && echo "$database_url" | vercel env add DATABASE_URL production)

echo -e "${GREEN}✅ DATABASE_URL updated!${NC}"
echo ""

# Step 2: Open deployment settings
echo -e "${YELLOW}Step 2: Configure Backend Build Settings${NC}"
echo "--------------------------------------"
echo ""
echo "Opening backend project settings..."
echo ""
echo -e "${BLUE}Please set these in the dashboard:${NC}"
echo ""
echo "  Root Directory: artifacts/api-server"
echo "  Build Command: cd ../.. && pnpm install && cd artifacts/api-server && pnpm run build"
echo "  Install Command: (leave empty)"
echo ""
read -p "Press Enter when ready to open settings..."

open "https://vercel.com/zunnoonwaheed-gmailcoms-projects/ai-news-fact-checker-api-server/settings" 2>/dev/null || \
  echo "Visit: https://vercel.com/zunnoonwaheed-gmailcoms-projects/ai-news-fact-checker-api-server/settings"

echo ""
read -p "Press Enter after you've saved the settings..."

# Step 3: Trigger backend deployment
echo ""
echo -e "${YELLOW}Step 3: Deploy Backend${NC}"
echo "--------------------------------------"
echo ""
echo "Opening deployments page..."
echo ""
read -p "Press Enter to open..."

open "https://vercel.com/zunnoonwaheed-gmailcoms-projects/ai-news-fact-checker-api-server/deployments" 2>/dev/null || \
  echo "Visit: https://vercel.com/zunnoonwaheed-gmailcoms-projects/ai-news-fact-checker-api-server/deployments"

echo ""
echo "Click 'Redeploy' on any deployment"
echo ""
read -p "Enter the backend URL once deployed (e.g., https://ai-news-fact-checker-api-server.vercel.app): " backend_url

if [ -z "$backend_url" ]; then
    echo -e "${YELLOW}No backend URL provided. Skipping frontend update.${NC}"
else
    # Step 4: Update frontend
    echo ""
    echo -e "${YELLOW}Step 4: Update Frontend${NC}"
    echo "--------------------------------------"
    echo ""
    echo -e "${BLUE}Setting VITE_API_URL for frontend...${NC}"

    cd ../../
    echo "$backend_url" | vercel env add VITE_API_URL production --force 2>/dev/null || \
      (vercel env rm VITE_API_URL production -y && echo "$backend_url" | vercel env add VITE_API_URL production)

    echo -e "${GREEN}✅ Frontend configured!${NC}"
    echo ""
    echo "Opening frontend deployments..."

    open "https://vercel.com/zunnoonwaheed-gmailcoms-projects/truth-detector/deployments" 2>/dev/null || \
      echo "Visit: https://vercel.com/zunnoonwaheed-gmailcoms-projects/truth-detector/deployments"

    echo ""
    echo "Click 'Redeploy' to update the frontend"
    echo ""
fi

echo ""
echo "================================================"
echo -e "${GREEN}🎉 Deployment Configuration Complete!${NC}"
echo "================================================"
echo ""
echo -e "${GREEN}Your app URLs:${NC}"
echo -e "  Frontend: ${BLUE}https://truth-detector-gamma.vercel.app${NC}"
echo -e "  Backend:  ${BLUE}$backend_url${NC}"
echo ""
echo -e "${GREEN}✨ Test your app by visiting the frontend URL!${NC}"
echo ""
