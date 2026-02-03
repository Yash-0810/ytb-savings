# Complete Deployment Guide - YTB Savings

## ✅ Code is Ready!
Your TypeScript errors have been fixed and the code is pushed to GitHub.

---

## 📋 Step-by-Step Deployment Process

### STEP 1: Create PostgreSQL Database on Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Sign up/Login with GitHub

2. **Create New PostgreSQL Database**
   - Click "New +" button (top right)
   - Select "PostgreSQL"

3. **Configure Database**
   - **Name**: `ytb-savings-db`
   - **Database**: `ytb_savings` (auto-filled)
   - **User**: `ytb_savings_user` (auto-filled)
   - **Region**: Oregon (Free) or closest to you
   - **PostgreSQL Version**: 16 (latest)
   - **Plan**: Free

4. **Create Database**
   - Click "Create Database"
   - Wait 2-3 minutes for provisioning

5. **Get Database URL** ⭐ IMPORTANT
   - Once created, scroll down to "Connections"
   - Find "External Database URL"
   - Click "Copy" button
   - **Save this URL** - you'll need it for the backend!
   - Format: `postgresql://user:password@host:5432/database`

---

### STEP 2: Deploy Backend on Render

#### Option A: Using Blueprint (Recommended - Easiest)

1. **Go to Render Dashboard**
   - Click "New +" → "Blueprint"

2. **Connect Repository**
   - Click "Connect a repository"
   - Select your GitHub account
   - Choose: `ytb-savings` repository
   - Click "Connect"

3. **Configure Blueprint**
   - Render will detect `render.yaml` automatically
   - Review the configuration
   - Click "Apply"

4. **Set Environment Variables**
   - You'll be prompted to set these:
   
   ```
   DATABASE_URL = [Paste the PostgreSQL URL from Step 1]
   FRONTEND_URL = https://ytb-savings.vercel.app (we'll update this later)
   JWT_SECRET = [Click "Generate" or use a random string]
   ```

5. **Deploy**
   - Click "Create" or "Deploy"
   - Wait 5-10 minutes for build

6. **Get Backend URL** ⭐ IMPORTANT
   - Once deployed, you'll see your service URL
   - Format: `https://ytb-savings-backend.onrender.com`
   - **Save this URL** - you'll need it for the frontend!

#### Option B: Manual Web Service (If Blueprint doesn't work)

1. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `ytb-savings`

2. **Configure Service**
   - **Name**: `ytb-savings-backend`
   - **Region**: Oregon (Free)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   ```
   NODE_ENV = production
   PORT = 8000
   DATABASE_URL = [Paste PostgreSQL URL from Step 1]
   JWT_SECRET = [Generate a random string - at least 32 characters]
   FRONTEND_URL = https://ytb-savings.vercel.app
   ```

4. **Create Web Service**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

5. **Get Backend URL**
   - Copy the URL shown at top: `https://ytb-savings-backend.onrender.com`

---

### STEP 3: Deploy Frontend on Vercel

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Click "Import" next to your `ytb-savings` repository

3. **Configure Project**
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)

4. **Add Environment Variable**
   - Click "Environment Variables"
   - Add:
     ```
     Name: VITE_API_URL
     Value: https://ytb-savings-backend.onrender.com/api
     ```
   - Replace with YOUR actual backend URL from Step 2

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes

6. **Get Frontend URL** ⭐ IMPORTANT
   - Once deployed, you'll see: `https://ytb-savings.vercel.app`
   - Or: `https://ytb-savings-[random].vercel.app`
   - **Copy this URL**

---

### STEP 4: Update Backend with Frontend URL

1. **Go back to Render Dashboard**
   - Open your backend service: `ytb-savings-backend`

2. **Update Environment Variable**
   - Go to "Environment" tab
   - Find `FRONTEND_URL`
   - Update value to your actual Vercel URL from Step 3
   - Example: `https://ytb-savings.vercel.app`

3. **Redeploy**
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait for redeployment

---

## 🎉 Your URLs Summary

After completing all steps, you'll have:

| Service | URL | Where to Find It |
|---------|-----|------------------|
| **Database** | `postgresql://user:pass@host:5432/db` | Render → PostgreSQL → Connections → External Database URL |
| **Backend API** | `https://ytb-savings-backend.onrender.com` | Render → Web Service → Top of page |
| **Frontend** | `https://ytb-savings.vercel.app` | Vercel → Project → Domains |

---

## ✅ Testing Your Deployment

1. **Open Frontend URL** in browser
2. **Sign Up** with a new account
3. **Login** with your credentials
4. **Add a transaction**
5. **View reports**

If everything works, congratulations! 🎉

---

## 🐛 Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify `DATABASE_URL` is correct
- Ensure all environment variables are set

### Frontend can't connect to backend
- Check `VITE_API_URL` in Vercel environment variables
- Verify backend URL is correct (include `/api` at the end)
- Check CORS: `FRONTEND_URL` in backend must match your Vercel URL exactly

### Database connection failed
- Verify PostgreSQL instance is running on Render
- Check connection string format
- Ensure database has been created successfully

---

## 💰 Free Tier Limits

- **Render PostgreSQL**: 90 days, 1GB storage, then $7/month
- **Render Web Service**: 750 hours/month, sleeps after 15min inactivity
- **Vercel**: 100GB bandwidth/month, unlimited projects

---

## 📝 Important Notes

1. **First Request Delay**: Render free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up.

2. **Database Expiry**: Free PostgreSQL expires after 90 days. You'll need to upgrade or migrate data.

3. **Custom Domain**: You can add a custom domain in Vercel settings (free).

4. **HTTPS**: Both Render and Vercel provide free SSL certificates automatically.

---

## Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Check deployment logs for specific errors
