# Frontend Deployment Guide - YTB Savings

## 🚀 Deploy Frontend to Render

### Prerequisites
✅ Backend already deployed at: https://ytb-savings.onrender.com
✅ Frontend build tested locally and working

---

## Option 1: Deploy via Render Dashboard (Recommended)

### Step 1: Create New Static Site
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Static Site"**

### Step 2: Connect Repository
1. **Connect your GitHub repository:** `Yash-0810/ytb-savings`
2. **Name:** `ytb-savings-frontend`
3. **Branch:** `main`
4. **Root Directory:** `frontend`

### Step 3: Build Settings
```
Build Command: npm install && npm run build
Publish Directory: dist
```

### Step 4: Environment Variables
Add the following environment variable:
```
VITE_API_URL = https://ytb-savings.onrender.com/api
```

### Step 5: Deploy
1. Click **"Create Static Site"**
2. Wait for build to complete (~1-2 minutes)
3. Your frontend will be live at: `https://ytb-savings-frontend.onrender.com`

---

## Option 2: Deploy via render.yaml (Automated)

### Step 1: Update Root render.yaml
The `frontend/render.yaml` is already configured. You can merge it with the root `render.yaml`:

```yaml
services:
  # Backend Service
  - type: web
    name: ytb-savings-backend
    runtime: node
    region: oregon
    plan: free
    rootDir: backend
    buildCommand: npm install && npm run build
    startCommand: node dist/index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: FRONTEND_URL
        value: https://ytb-savings-frontend.onrender.com

  # Frontend Service
  - type: web
    name: ytb-savings-frontend
    runtime: node
    region: oregon
    plan: free
    rootDir: frontend
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_URL
        value: https://ytb-savings.onrender.com/api
```

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Add frontend deployment configuration"
git push
```

### Step 3: Render Auto-Deploy
Render will automatically detect the render.yaml and deploy both services.

---

## Option 3: Deploy to Vercel (Alternative - Faster)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
cd frontend
vercel --prod
```

### Step 3: Set Environment Variables
When prompted, add:
```
VITE_API_URL=https://ytb-savings.onrender.com/api
```

---

## 🔧 Post-Deployment Configuration

### Update Backend CORS
After frontend is deployed, update backend to allow frontend URL:

1. Go to Render Dashboard → ytb-savings-backend
2. Add environment variable:
   ```
   FRONTEND_URL=https://ytb-savings-frontend.onrender.com
   ```
3. Redeploy backend

---

## ✅ Verify Deployment

### Test Frontend
1. Visit: `https://ytb-savings-frontend.onrender.com`
2. You should see the login page
3. Try signing up with a test account
4. Verify transactions work

### Test API Connection
Open browser console and check:
- No CORS errors
- API calls going to correct backend URL
- Authentication working

---

## 📊 Expected URLs

| Service | URL |
|---------|-----|
| Frontend | https://ytb-savings-frontend.onrender.com |
| Backend API | https://ytb-savings.onrender.com |
| API Health | https://ytb-savings.onrender.com/api/health |

---

## 🐛 Troubleshooting

### Issue: White screen / Blank page
**Solution:** Check browser console for errors. Usually CORS or API URL misconfiguration.

### Issue: API calls failing
**Solution:** 
1. Verify `VITE_API_URL` is set correctly
2. Check backend CORS allows frontend URL
3. Verify backend is running

### Issue: 404 on page refresh
**Solution:** The `_redirects` file should handle this. Verify it's in the dist folder.

### Issue: Build fails
**Solution:**
1. Check build logs in Render dashboard
2. Verify all dependencies are in package.json
3. Test build locally: `npm run build`

---

## 🎯 Files Created for Deployment

```
frontend/
├── .env.production          # Production environment variables
├── render.yaml              # Render deployment config
├── _redirects               # SPA routing support
├── vite.config.ts           # Updated with build optimizations
├── src/vite-env.d.ts        # TypeScript environment types
└── package.json             # Updated build script
```

---

## 🚀 Quick Deploy Commands

```bash
# Test build locally
cd frontend
npm run build
npm run preview

# Commit and push
git add .
git commit -m "Configure frontend for production deployment"
git push

# Deploy to Render (via dashboard or CLI)
# Or deploy to Vercel
vercel --prod
```

---

## 📝 Notes

- Frontend is a static site (no server needed)
- Build time: ~30-60 seconds
- Free tier includes:
  - 100 GB bandwidth/month
  - Global CDN
  - Automatic SSL
  - Custom domains

---

## ✨ Next Steps After Deployment

1. ✅ Test all features (signup, login, transactions, reports)
2. ✅ Set up custom domain (optional)
3. ✅ Configure Google OAuth (optional)
4. ✅ Monitor performance in Render dashboard
5. ✅ Set up error tracking (Sentry, etc.)

---

**Your full-stack app will be live!** 🎉
