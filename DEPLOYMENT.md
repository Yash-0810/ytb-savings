# Deployment Guide for YTB Savings

This guide will help you deploy YTB Savings online so everyone can access it from anywhere. All services recommended here have free tiers.

## Architecture Overview

```
Frontend (Vercel/Netlify) ←→ Backend (Render) ←→ Database (PostgreSQL on Render/Railway)
```

## Step 1: Prepare Your Code for Deployment

### 1.1 Push Code to GitHub

1. Create a new repository on GitHub: https://github.com/new
   - Repository name: `ytb-savings`
   - Set to Public or Private

2. Push your code:
```bash
cd /Users/yash/Coding/webistes/Saving
git init
git add .
git commit -m "Initial commit - YTB Savings financial management app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ytb-savings.git
git push -u origin main
```

### 1.2 Environment Variables

The following files have been created/updated:
- `backend/.env.example` - Template for backend environment variables
- `frontend/.env.example` - (Create this) Template for frontend environment variables

## Step 2: Deploy Database (Free Options)

### Option A: Render.com (Recommended)

1. Go to https://dashboard.render.com and sign up
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: `ytb-savings-db`
   - Plan: Free (starts at $0/month)
   - Region: Choose closest to your users
4. Click "Create Database"
5. Wait for it to provision, then copy the "External Database URL"

### Option B: Railway.app

1. Go to https://railway.app and sign up
2. Click "New Project" → "Provision PostgreSQL"
3. Copy the PostgreSQL connection URL from the settings

## Step 3: Deploy Backend (Render.com)

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `ytb-savings-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=8000
   DATABASE_URL=postgresql://YOUR_POSTGRES_URL_HERE
   JWT_SECRET=generate-a-secure-random-string-here
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

6. Click "Create Web Service"

## Step 4: Deploy Frontend (Vercel - Recommended)

1. Go to https://vercel.com and sign up
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
6. Click "Deploy"

## Step 5: Update Frontend API URL

After backend deployment, update the frontend environment variable on Vercel:
1. Go to your Vercel project settings
2. Add/Update: `VITE_API_URL` = `https://ytb-savings-backend.onrender.com/api`

## Step 6: Test Your Deployment

1. Open your Vercel URL (e.g., `https://ytb-savings.vercel.app`)
2. Try signing up a new user
3. Login with the new credentials
4. Add some transactions
5. Generate reports

All data will be stored online in your PostgreSQL database!

## Free Tier Limits

### Render.com
- **PostgreSQL**: 90 days retention, 1GB storage
- **Web Service**: 750 hours/month, 512MB RAM
- **Note**: Service sleeps after 15 min inactivity, takes ~30 sec to wake up

### Vercel
- **Bandwidth**: 100GB/month
- **Serverless Functions**: 100 hours/month
- **Builds**: 100 builds/month

## Production Checklist

Before going live:

1. [ ] Set strong `JWT_SECRET` in backend environment variables
2. [ ] Configure `FRONTEND_URL` to your actual Vercel domain
3. [ ] Test user signup and login flow
4. [ ] Test transaction creation and report generation
5. [ ] Verify email configuration (optional, for OTP verification)

## Troubleshooting

### Backend not starting
- Check Render logs for errors
- Ensure `DATABASE_URL` is correct
- Verify all environment variables are set

### CORS errors
- Ensure `FRONTEND_URL` in backend matches your Vercel domain exactly
- Include `https://` protocol

### Database connection failed
- Ensure PostgreSQL instance is active
- Check connection string format: `postgresql://user:pass@host:5432/dbname`

## Estimated Monthly Cost

| Service | Cost |
|---------|------|
| Render PostgreSQL | $0 (free tier) |
| Render Web Service | $0 (free tier) |
| Vercel Frontend | $0 (free tier) |
| **Total** | **$0/month** |

## Need Help?

- Render docs: https://render.com/docs
- Vercel docs: https://vercel.com/docs
- PostgreSQL basics: https://www.postgresql.org/docs/

