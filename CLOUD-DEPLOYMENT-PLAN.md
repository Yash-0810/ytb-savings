# Cloud Deployment Plan for YTB Savings

## 📋 Overview
This plan covers:
1. Migrating from SQLite to PostgreSQL (cloud database)
2. Deploying the entire project to GitHub
3. Deploying backend and frontend to production

---

## 🎯 Phase 1: Database Migration (SQLite → PostgreSQL)

### Current State
- Backend uses `better-sqlite3` with local `finance.db` file
- Database has placeholder code for PostgreSQL support

### Actions Required
1. **Install PostgreSQL driver**
   ```bash
   cd backend && npm install pg
   npm install -D @types/pg
   ```

2. **Update `backend/src/db/database.ts`**
   - Implement full PostgreSQL support using the `pg` library
   - Add connection pooling
   - Create tables with proper schema

3. **Create environment templates**
   - `backend/.env.example` - Already exists, update if needed
   - `frontend/.env.example` - Create if doesn't exist

---

## 🎯 Phase 2: GitHub Repository Setup

### Prerequisites
- [ ] Install GitHub CLI (`brew install gh`)
- [ ] Authenticate with GitHub (`gh auth login`)

### Actions Required
1. **Create GitHub repository**
   ```bash
   gh repo create ytb-savings --public --description "YTB Savings - Financial Management Application"
   ```

2. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit - YTB Savings financial management app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ytb-savings.git
   git push -u origin main
   ```

3. **Create necessary GitHub files**
   - `.github/workflows/ci.yml` - CI/CD pipeline
   - Update existing files as needed

---

## 🎯 Phase 3: Deploy Backend (Render.com)

### Actions Required
1. **Deploy to Render.com**
   - Connect GitHub repository
   - Configure build and start commands
   - Add environment variables
   - Set up PostgreSQL database on Render

2. **Environment Variables Needed**
   ```
   NODE_ENV=production
   PORT=8000
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   JWT_SECRET=your-secure-random-string
   FRONTEND_URL=https://your-frontend.vercel.app
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

---

## 🎯 Phase 4: Deploy Frontend (Vercel)

### Actions Required
1. **Deploy to Vercel**
   - Import GitHub repository
   - Configure build settings
   - Add environment variables

2. **Environment Variables Needed**
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

---

## 🎯 Phase 5: Testing & Verification

### Checklist
- [ ] Test user registration
- [ ] Test user login
- [ ] Test transaction creation
- [ ] Test daily/monthly/annual reports
- [ ] Verify data persists across sessions
- [ ] Test on mobile devices

---

## 📊 Cost Estimation

| Service | Free Tier | Cost |
|---------|-----------|------|
| Render PostgreSQL | 90 days, 1GB | $0/mo |
| Render Web Service | 750 hrs/month | $0/mo |
| Vercel | 100GB bandwidth | $0/mo |
| **Total** | | **$0/mo** |

---

## ⏱️ Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Database Migration | 30 min | ⏳ Pending |
| GitHub Setup | 15 min | ⏳ Pending |
| Backend Deploy | 20 min | ⏳ Pending |
| Frontend Deploy | 15 min | ⏳ Pending |
| Testing | 15 min | ⏳ Pending |
| **Total** | **~1.5 hours** | |

---

## 🔐 Security Considerations

1. **Never commit `.env` files**
2. **Use strong JWT secrets** (at least 32 characters)
3. **Enable CORS only for production frontend**
4. **Use app-specific passwords for email**

---

## 📝 Notes

- Render free tier services sleep after 15 minutes of inactivity
- First request after sleep may take 30+ seconds
- Consider upgrading for production use

