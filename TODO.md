# Cloud Deployment TODO List

## Phase 1: Database Migration (SQLite → PostgreSQL)
- [ ] Install PostgreSQL driver (`pg`) in backend
- [ ] Update `backend/src/db/database.ts` with full PostgreSQL support
- [ ] Create `.env` file with PostgreSQL connection string
- [ ] Test database connection locally

## Phase 2: GitHub Repository Setup
- [ ] Initialize git repository
- [ ] Create GitHub repository (`ytb-savings` for user `Yash-0810`)
- [ ] Push all code to GitHub
- [ ] Create CI/CD workflow file

## Phase 3: Deploy Backend (Render.com)
- [ ] Create Render.com account and connect GitHub
- [ ] Provision PostgreSQL database on Render
- [ ] Deploy backend web service
- [ ] Set environment variables in Render
- [ ] Test backend API

## Phase 4: Deploy Frontend (Vercel)
- [ ] Create Vercel account and connect GitHub
- [ ] Deploy frontend application
- [ ] Set environment variables in Vercel
- [ ] Update API URL after backend deployment

## Phase 5: Testing & Verification
- [ ] Test user registration on deployed site
- [ ] Test user login
- [ ] Test transaction creation
- [ ] Test reports functionality
- [ ] Verify data persists online

---

## Quick Commands Reference

### Install PostgreSQL driver
```bash
cd backend && npm install pg && npm install -D @types/pg
```

### Initialize git and push to GitHub
```bash
cd /Users/yash/Coding/webistes/Saving
git init
git add .
git commit -m "Initial commit - YTB Savings financial management app"
gh repo create ytb-savings --public --description "Financial Management Application"
git branch -M main
git remote add origin https://github.com/Yash-0810/ytb-savings.git
git push -u origin main
```

---

## Environment Variables Needed

### Backend (.env)
```
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secure-secret
FRONTEND_URL=https://...
```

### Frontend (.env)
```
VITE_API_URL=https://...
VITE_GOOGLE_CLIENT_ID=...
```

---

## URLs After Deployment
- Frontend: https://ytb-savings.vercel.app
- Backend: https://ytb-savings-backend.onrender.com
- Database: PostgreSQL on Render

