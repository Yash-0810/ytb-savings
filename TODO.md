# Deployment Setup - Online Data Storage

## ✅ Completed Tasks

### 1. Environment Variable Support
- [x] Created `backend/.env.example` - Backend environment configuration template
- [x] Created `frontend/.env.example` - Frontend environment configuration template
- [x] Updated `frontend/src/api/client.ts` - Uses VITE_API_URL environment variable
- [x] Updated `frontend/vite.config.d.ts` - Added TypeScript type declarations for Vite environment variables
- [x] Updated `backend/src/db/database.ts` - Added dotenv configuration

### 2. Deployment Guide
- [x] Created `DEPLOYMENT.md` - Comprehensive deployment guide with step-by-step instructions

## Next Steps (For You)

### 1. Push Code to GitHub
```bash
cd /Users/yash/Coding/webistes/Saving
git add .
git commit -m "Prepare for deployment - add environment variables"
git push
```

### 2. Deploy Using Free Services

| Service | Purpose | Link |
|---------|---------|------|
| Render.com | Backend + PostgreSQL | https://render.com |
| Vercel.com | Frontend | https://vercel.com |

### 3. Configure Environment Variables
After deploying, set these environment variables:

**Backend (Render):**
- `DATABASE_URL`: PostgreSQL connection string from Render
- `JWT_SECRET`: Generate a random secure string
- `FRONTEND_URL`: Your Vercel frontend URL

**Frontend (Vercel):**
- `VITE_API_URL`: Your Render backend URL + `/api`

## Estimated Cost: $0/month (Free Tier)

## Quick Deploy Links
1. **Database**: https://dashboard.render.com → New → PostgreSQL
2. **Backend**: https://dashboard.render.com → New → Web Service
3. **Frontend**: https://vercel.com → Add New Project

