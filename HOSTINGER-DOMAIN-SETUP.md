# 🌐 Connect ytbstorage.space to FinanceHub (Hostinger)

## Your Domain: ytbstorage.space

## Step 1: Add Domains in Render

### Frontend:
1. Go to: https://dashboard.render.com
2. Click on `ytbsavingsfront` service
3. Click **"Settings"** tab
4. Scroll to **"Custom Domains"**
5. Click **"Add Custom Domain"**
6. Enter: `ytbstorage.space`
7. Click **"Add Domain"**

### Backend:
1. Go to: https://dashboard.render.com  
2. Click on `ytb-savings` service
3. Click **"Settings"** tab
4. Scroll to **"Custom Domains"**
5. Click **"Add Custom Domain"**
6. Enter: `api.ytbstorage.space`
7. Click **"Add Domain"**

---

## Step 2: Configure DNS in Hostinger

### Login to Hostinger:
1. Go to: https://hpanel.hostinger.com
2. Login with your credentials
3. Click on **"Domains"**
4. Click on `ytbstorage.space`

### Add DNS Records:

#### Option A: CNAME Records (Recommended)

Find **"DNS Records"** or **"Zone Editor"** section:

**Record 1 - Frontend:**
```
Type: CNAME
Name: @
Point to: ytbsavingsfront.onrender.com
TTL: Auto
```

**Record 2 - API Subdomain:**
```
Type: CNAME  
Name: api
Point to: ytb-savings.onrender.com
TTL: Auto
```

**Record 3 - WWW (optional):**
```
Type: CNAME
Name: www
Point to: ytbsavingsfront.onrender.com
TTL: Auto
```

#### Option B: A Records (Alternative)

**Frontend:**
```
Type: A
Name: @
IP: 159.89.195.6
TTL: Auto
```

**API:**
```
Type: A
Name: api
IP: 159.89.195.6
TTL: Auto
```

---

## Step 3: Wait for DNS Propagation

- Time: **5-15 minutes** (usually)
- Max time: **24 hours**

---

## Step 4: Verify in Render

After adding DNS records:

1. Go to Render dashboard
2. Check your services
3. Under **"Custom Domains"**, status should change from:
   - ❌ "Pending verification" → ✅ "Active" (green)

---

## 🎯 What You'll Get:

**Frontend:** https://ytbstorage.space → FinanceHub React App  
**API:** https://api.ytbstorage.space → Backend API

---

## 🔧 Update Code (If Needed)

### Frontend API URL:

Create/edit: `frontend/.env.production`
```
VITE_API_URL=https://api.ytbstorage.space/api
```

### Backend CORS:

Edit: `backend/src/index.ts`
```typescript
app.use(cors({
  origin: ['https://ytbstorage.space', 'https://www.ytbstorage.space'],
  credentials: true
}));
```

---

## 📋 Complete Hostinger Setup Checklist

### In Render Dashboard:
- [ ] Add `ytbstorage.space` to ytbsavingsfront
- [ ] Add `api.ytbstorage.space` to ytb-savings
- [ ] Wait for "Active" status (green)

### In Hostinger hPanel:
- [ ] Add CNAME record for `@` → `ytbsavingsfront.onrender.com`
- [ ] Add CNAME record for `api` → `ytb-savings.onrender.com`
- [ ] Wait 5-15 minutes for propagation

### Test:
- [ ] Visit: https://ytbstorage.space → Should see FinanceHub
- [ ] Visit: https://api.ytbstorage.space/api/health → Should show JSON

---

## 🔍 Verify DNS Propagation

Test your DNS:
1. Visit: https://dnschecker.org
2. Enter: `ytbstorage.space`
3. Check if all locations show your Render IP

Or via terminal:
```bash
nslookup ytbstorage.space
dig api.ytbstorage.space
```

---

## 🆘 Troubleshooting

**"Domain pending verification"**
- Wait 5-15 more minutes
- Check DNS records are correct in Hostinger
- Make sure no typos in domain names

**"Too many redirects"**
- Clear browser cache
- Check CORS settings in backend

**"Connection refused"**
- Verify Render services are deployed
- Check Render service status

**DNS not updating**
- Reduce TTL to 5 minutes in Hostinger
- Wait longer for propagation

---

## 📞 Hostinger Support

If you need help with Hostinger:
1. Go to: https://hpanel.hostinger.com → Support
2. Or: https://www.hostinger.com/help-center

---

## 🎉 Expected Result:

After setup:
- **Main Site:** https://ytbstorage.space → Your FinanceHub app!
- **API:** https://api.ytbstorage.space → Backend API

Users can visit `ytbstorage.space` to access your full financial management application!

---

## ⏱️ Timeline:

- **Step 1 (Render):** 2 minutes
- **Step 2 (Hostinger):** 5 minutes
- **Step 3 (Wait):** 5-15 minutes
- **Total:** ~15-25 minutes

Follow the steps and you'll have a custom domain! 🚀

