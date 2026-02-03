# Cloud Deployment TODO List

## ✅ Phase 1: Database Migration (SQLite → PostgreSQL)
- [x] Install PostgreSQL driver (`pg`) in backend
- [x] Update `backend/src/db/database.ts` with full PostgreSQL support
- [x] Create `.env` file with PostgreSQL connection string
- [x] Test database connection locally

## ✅ Phase 2: GitHub Repository Setup
- [x] Initialize git repository
- [x] Create GitHub repository (`ytb-savings` for user `Yash-0810`)
- [x] Push all code to GitHub
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

## ✅ Completed Successfully!

🎉 **GitHub Repository Created:**
- **URL:** https://github.com/Yash-0810/ytb-savings
- **Status:** Public repository with full code pushed

📦 **Code Features:**
- Full PostgreSQL support for cloud deployment
- Environment variable configuration
- Dual database support (SQLite for local, PostgreSQL for production)

---

## Quick Commands Reference

### Install PostgreSQL driver
```bash
cd backend && npm install pg && npm install -D @types/pg
```

### GitHub Repository
- **URL:** https://github.com/Yash-0810/ytb-savings
- **Clone:** `git clone https://github.com/Yash-0810/ytb-savings.git`

---

## URLs After Deployment
- Frontend: https://ytb-savings.vercel.app (TBD)
- Backend: https://ytb-savings-backend.onrender.com (TBD)
- Database: PostgreSQL on Render (TBD)

---

## Next Steps (Do These on Render.com)

### 1. Deploy Backend
1. Go to https://dashboard.render.com
2. Create account and connect GitHub
3. Click "New +" → "Web Service"
4. Connect `Yash-0810/ytb-savings`
5. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

### 2. Create PostgreSQL Database
1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Configure and create
4. Copy the connection URL

### 3. Add Environment Variables
In Render backend service:
```
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://... (from step 2)
JWT_SECRET=your-secure-secret (generate one!)
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

### 4. Deploy Frontend on Vercel
1. Go to https://vercel.com
2. Import `Yash-0810/ytb-savings`
3. Root Directory: `frontend`
4. Add: `VITE_API_URL=https://your-render-backend.onrender.com/api`
5. Deploy!

