# 🚀 Live Deployment Guide for YTB Savings

## Domain: ytbstorage.space
## Provider: Hostinger
## Services: Render (Backend) + Vercel (Frontend)

---

## 📋 Architecture

```
                    ┌─────────────────────────────────────┐
                    │          Hostinger DNS              │
                    │      (ytbstorage.space)             │
                    └─────────────────┬───────────────────┘
                                      │
           ┌──────────────────────────┴──────────────────────────┐
           │                                                      │
           ▼                                                      ▼
┌─────────────────────────┐                        ┌─────────────────────────┐
│   Vercel (Frontend)     │                        │  Render (Backend)       │
│   ytbstorage.space      │                        │  api.ytbstorage.space   │
│   --------------------- │                        │  ---------------------  │
│   - React App           │                        │  - Node.js API          │
│   - Static files        │                        │  - PostgreSQL DB        │
│   - Free tier           │                        │  - Free tier            │
└─────────────────────────┘                        └─────────────────────────┘
```

---

## 🎯 Phase 1: Deploy Backend to Render.com

### Step 1.1: Create Render Account
1. Go to https://dashboard.render.com
2. Sign up with GitHub (easy authentication)
3. Authorize Render to access your GitHub

### Step 1.2: Create PostgreSQL Database
1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name:** `ytb-savings-db`
   - **Plan:** Free (-starter is $7/mo, avoid unless needed)
   - **Region:** Select closest to your users
3. Click **"Create Database"**
4. **WAIT** for it to provision (2-3 minutes)
5. Once ready, scroll down to **"Connection"** section
6. Copy the **"External Database URL"** (starts with `postgres://`)

⚠️ **IMPORTANT:** Save this URL somewhere safe! You'll need it.

### Step 1.3: Deploy Backend Web Service
1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub:
   - Click **"Connect GitHub"**
   - Find and select `Yash-0810/ytb-savings`
3. Configure:
   - **Name:** `ytb-savings-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
4. Click **"Create Web Service"**
5. Wait for build to complete (2-3 minutes)

### Step 1.4: Add Environment Variables
1. In your backend service, click **"Environment"** tab
2. Add these variables (click "Add" for each):

```
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://YOUR_POSTGRES_URL_HERE
JWT_SECRET=generate-a-secure-random-string-here
FRONTEND_URL=https://ytbstorage.space
```

**To generate JWT_SECRET, run this in terminal:**
```bash
openssl rand -base64 32
```

3. Click **"Save Changes"**
4. Render will automatically redeploy

### Step 1.5: Get Backend URL
1. After deployment, you'll see a URL like:
   `https://ytb-savings-backend.onrender.com`
2. Copy this - you'll need it for frontend!

---

## 🎯 Phase 2: Deploy Frontend to Vercel

### Step 2.1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your GitHub

### Step 2.2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Find and select `Yash-0810/ytb-savings`
3. Click **"Import"**

### Step 2.3: Configure Frontend
1. **Root Directory:** `frontend`
2. **Framework Preset:** `Vite` (auto-detected)
3. Click **"Deploy"**

### Step 2.4: Add Environment Variables
1. After deployment, go to project **"Settings"** → **"Environment Variables"**
2. Add:
   ```
   VITE_API_URL=https://ytb-savings-backend.onrender.com/api
   ```
3. Click **"Save"**
4. Vercel will redeploy automatically

### Step 2.5: Get Frontend URL
1. After deploy, you'll get a URL like:
   `https://ytb-savings.vercel.app`
2. Copy this for domain configuration

---

## 🎯 Phase 3: Configure Custom Domain (Hostinger)

### Step 3.1: Get Vercel Domain Nameservers
1. In Vercel, go to **"Settings"** → **"Domains"**
2. Click **"Add Domain"**
3. Enter: `ytbstorage.space`
4. Vercel will show you nameservers like:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ```
5. Copy these 3 nameservers

### Step 3.2: Get Render Backend Domain
1. In Render, go to your backend service
2. Click **"Settings"** → **"Custom Domains"**
3. Add: `api.ytbstorage.space`
4. Render will give you a CNAME target like:
   `d1234567890.render.com`
5. Copy this CNAME target

### Step 3.3: Configure Hostinger DNS
1. Go to https://hpanel.hostinger.com
2. Log in to your account
3. Find **"Domains"** → **"ytbstorage.space"**
4. Look for **"DNS"** or **"Nameservers"** section

**Option A: Use Hostinger's Nameservers (Recommended)**
1. Change nameservers to Vercel's:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ```
2. Save changes
3. Wait 24-48 hours for propagation

**Option B: Keep Hostinger Nameservers (Add CNAME records)**
1. Add these DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | cname.vercel-dns.com | Auto |
| CNAME | api | d1234567890.render.com | Auto |

2. Save changes

### Step 3.4: Verify Domain Configuration
1. Go back to Vercel **"Domains"** section
2. Click **"Verify"** next to `ytbstorage.space`
3. If successful, you'll see ✅ "Verified"

---

## 🎯 Phase 4: Update Backend CORS

### Step 4.1: Get Final Domain URL
Once domain is verified, your frontend will be at:
`https://ytbstorage.space`

### Step 4.2: Update Backend Environment Variable
1. In Render, go to backend **"Environment"**
2. Update:
   ```
   FRONTEND_URL=https://ytbstorage.space
   ```
3. Save and redeploy

---

## 🎯 Phase 5: Test Your Live Website!

### Test These:
1. ✅ Open https://ytbstorage.space
2. ✅ Sign up a new user
3. ✅ Login with that user
4. ✅ Add some transactions (debits/credits)
5. ✅ View Daily/Monthly/Annual reports
6. ✅ Test on mobile device

### Verify Backend API:
1. Visit: https://api.ytbstorage.space/api/health
2. Should return: `{"status":"OK"}`

---

## 📊 Cost Summary

| Service | Free Tier | Monthly Cost |
|---------|-----------|--------------|
| Vercel (Frontend) | 100GB bandwidth, 100 builds | $0 |
| Render (Backend) | 750 hours, 512MB RAM | $0 |
| Render (PostgreSQL) | 90 days retention, 1GB | $0 |
| **Total** | | **$0/month** |

⚠️ **Note:** Render free tier services sleep after 15 minutes of inactivity. First request after sleep may take 30+ seconds.

---

## 🔧 Troubleshooting

### Issue: "Service Unavailable" on first load
- **Cause:** Free tier services sleep
- **Solution:** Upgrade to paid plan or wait 30-60 seconds

### Issue: CORS Errors
- **Check:** Ensure `FRONTEND_URL` matches your domain exactly
- **Include:** `https://` protocol

### Issue: Database Connection Failed
- **Check:** Verify `DATABASE_URL` is correct in Render
- **Format:** `postgresql://user:pass@host:5432/dbname`

### Issue: Domain Not Verifying
- **Wait:** DNS propagation takes 24-48 hours
- **Check:** Use https://dnschecker.org to verify DNS

---

## 📞 Quick Links

| Service | URL |
|---------|-----|
| Render Dashboard | https://dashboard.render.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| Hostinger hPanel | https://hpanel.hostinger.com |
| GitHub Repo | https://github.com/Yash-0810/ytb-savings |
| DNS Checker | https://dnschecker.org |

---

## ✅ Final Checklist

- [ ] PostgreSQL created on Render
- [ ] Backend deployed on Render with DATABASE_URL
- [ ] Frontend deployed on Vercel with VITE_API_URL
- [ ] Domain `ytbstorage.space` added to Vercel
- [ ] Domain `api.ytbstorage.space` added to Render
- [ ] DNS configured on Hostinger
- [ ] CORS updated with FRONTEND_URL
- [ ] Website tested and working!

---

## 🎉 You're Live!

Your financial management website is now accessible at:
**https://ytbstorage.space**

Backend API: **https://api.ytbstorage.space**

All user data is stored securely online in PostgreSQL!

