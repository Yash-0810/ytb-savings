# 🌐 Connect Custom Domain to FinanceHub

## Prerequisites

1. **Own a domain** (e.g., `yourdomain.com`, `financehub.com`)
2. **Domain registrar access** (GoDaddy, Namecheap, Google Domains, etc.)
3. **Both services deployed:**
   - Frontend: ytbsavingsfront.onrender.com
   - Backend: ytb-savings.onrender.com

## Option 1: Use Subdomains (Recommended)

### Step 1: Add Domains in Render

**For Frontend:**
1. Go to: https://dashboard.render.com
2. Click on your frontend service: `ytbsavingsfront`
3. Click **"Settings"** tab
4. Scroll to **"Custom Domains"**
5. Click **"Add Custom Domain"**
6. Enter: `www.yourdomain.com`
7. Click **"Add Domain"**

**For Backend:**
1. Go to: https://dashboard.render.com
2. Click on your backend service: `ytb-savings`
3. Click **"Settings"** tab
4. Scroll to **"Custom Domains"**
5. Click **"Add Custom Domain"**
6. Enter: `api.yourdomain.com`
7. Click **"Add Domain"**

### Step 2: Configure DNS in Your Registrar

Go to your domain registrar (GoDaddy/Namecheap/etc.):

**Add CNAME Records:**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | www | ytbsavingsfront.onrender.com | Auto |
| CNAME | api | ytb-savings.onrender.com | Auto |

**Or if using A records:**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 159.89.195.6 | Auto |
| A | www | 159.89.195.6 | Auto |
| A | api | 159.89.195.6 | Auto |

**Note:** Replace `159.89.195.6` with Render's IP if needed (check Render dashboard for exact IP)

### Step 3: Wait for DNS Propagation
- Time: 5 minutes to 24 hours (usually 5-15 minutes)
- Test with: https://www.whatsmydns.net

---

## Option 2: Single Domain for Frontend Only

If you only want one domain:

1. Go to Render dashboard → ytbsavingsfront service → Settings → Custom Domains
2. Add: `www.yourdomain.com`
3. Configure DNS as above

---

## Option 3: Redirect Backend to Custom Domain

If using API at `yourdomain.com/api`:

**Update Frontend Environment Variable:**
1. Go to Render → ytbsavingsfront → Settings
2. Edit env var: `VITE_API_URL` = `https://yourdomain.com/api`
3. Redeploy frontend

**Or Update API calls in code:**
```typescript
// frontend/src/api/client.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://yourdomain.com/api';
```

---

## 🎯 Recommended Setup

### Primary Domain: `www.yourdomain.com` → Frontend
```
Type: CNAME
Host: www
Value: ytbsavingsfront.onrender.com
```

### API Subdomain: `api.yourdomain.com` → Backend
```
Type: CNAME  
Host: api
Value: ytb-savings.onrender.com
```

### Root Domain: `yourdomain.com` → Frontend (optional)
```
Type: CNAME
Host: @
Value: ytbsavingsfront.onrender.com
```

---

## 🔧 Update Code for Custom Domain

### Frontend API Calls
If using custom domain for API, update:

**File:** `frontend/.env.production`
```
VITE_API_URL=https://api.yourdomain.com/api
```

### Backend CORS (if needed)
If accessing backend from custom domain:

**File:** `backend/src/index.ts`
```typescript
app.use(cors({
  origin: ['https://www.yourdomain.com', 'https://yourdomain.com'],
  credentials: true
}));
```

---

## 📋 Complete Setup Checklist

### 1. Domain Registrar
- [ ] Add CNAME records for www and api subdomains
- [ ] Wait for DNS propagation (5-15 minutes)

### 2. Render Backend
- [ ] Go to ytb-savings service
- [ ] Settings → Custom Domains
- [ ] Add: `api.yourdomain.com`
- [ ] Wait for SSL certificate (automatic)

### 3. Render Frontend  
- [ ] Go to ytbsavingsfront service
- [ ] Settings → Custom Domains
- [ ] Add: `www.yourdomain.com`
- [ ] Wait for SSL certificate (automatic)

### 4. Test Everything
- [ ] Visit: https://www.yourdomain.com → Should show FinanceHub UI
- [ ] Visit: https://api.yourdomain.com/api/health → Should show JSON
- [ ] Signup/Login works
- ✅ Transactions work

---

## 🎉 Final Result

After setup:
- **Main Site:** https://www.yourdomain.com → FinanceHub React App
- **API:** https://api.yourdomain.com/api → Backend API

Users visit your custom domain and see the full FinanceHub interface with your branding!

---

## ⚠️ Important Notes

1. **SSL Certificates:** Render automatically provisions SSL for custom domains
2. **DNS Propagation:** Can take 5-15 minutes, sometimes up to 24 hours
3. **Pricing:** Custom domains are free on Render (no paid plan needed)
4. **Subdomains:** Use `www` or `app` for frontend, `api` for backend
5. **HTTPS:** Always enforced on custom domains (Render default)

---

## 🔍 Verify DNS Setup

Check your DNS configuration:
1. Visit: https://www.whatsmydns.net
2. Enter: `www.yourdomain.com`
3. Should show: `ytbsavingsfront.onrender.com`

Or test via terminal:
```bash
nslookup www.yourdomain.com
dig api.yourdomain.com
```

---

## 🆘 Troubleshooting

**"Domain not verified"**
- Wait 5-15 minutes for DNS propagation
- Check CNAME records are correct

**"SSL certificate pending"**
- Normal - takes a few minutes
- Render handles this automatically

**"Too many redirects"**
- Clear browser cache
- Check CORS settings in backend

**"Connection refused"**
- Verify both Render services are deployed
- Check Render service status

---

## 📞 Need Help?

If you have any issues:
1. Check Render documentation: https://render.com/docs/custom-domains
2. Contact Render support through dashboard
3. Verify DNS with: https://www.whatsmydns.net

---

## 🎊 Your Custom Domain Setup

Once complete, you'll have:
- **Professional appearance:** Your domain builds trust
- **Full control:** Easy to manage and update
- **Branded experience:** Users see your domain, not Render's
- **SEO benefits:** Custom domain better for search engines

Good luck! 🚀

