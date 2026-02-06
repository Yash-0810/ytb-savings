# 🔧 Fix Google OAuth Error

## Error: "Missing required parameter: client_id"

This error means Google OAuth isn't properly configured. Let's fix it!

---

## Step 1: Get Your Google OAuth Client ID

### Option A: Use Existing Client ID

If you already created a Google OAuth client:
1. Go to: https://console.cloud.google.com
2. Login with your Google account
3. Navigate to: **APIs & Services** → **Credentials**
4. Copy your **OAuth 2.0 Client ID**

### Option B: Create New OAuth Client (Recommended)

1. Go to: https://console.cloud.google.com
2. Click **"Select a project"** → **"New Project"**
3. Create project:
   ```
   Name: FinanceHub OAuth
   Location: No organization
   ```
4. Click **"CREATE"**
5. Wait for project creation...

6. Go to **OAuth consent screen**
7. Select **"External"** → Click **"CREATE"**
8. Fill in:
   ```
   App name: FinanceHub
   User support email: your email
   Developer contact email: your email
   ```
9. Click **"SAVE AND CONTINUE"** (through all steps)

10. Go to **Credentials** → **"CREATE CREDENTIALS"** → **"OAuth client ID"**
11. Configure:
    ```
    Application type: Web application
    Name: FinanceHub Web
    ```
12. **Authorized JavaScript origins:**
    ```
    https://ytbsavingsfront.onrender.com
    https://www.ytbstorage.space
    ```
13. **Authorized redirect URIs:**
    ```
    https://ytbsavingsfront.onrender.com
    https://www.ytbstorage.space
    ```
14. Click **"CREATE"**
15. Copy your **Client ID** and **Client Secret**

---

## Step 2: Add Environment Variables in Render

### Backend (for Google auth):
1. Go to: https://dashboard.render.com
2. Open your backend service: **ytb-savings**
3. Click **"Environment"** tab
4. Add these variables:
   ```
   GOOGLE_CLIENT_ID: your_client_id_here
   GOOGLE_CLIENT_SECRET: your_client_secret_here
   ```
5. Click **"Save Changes"**
6. **Redeploy** the backend service

### Frontend (for Google Login):
1. Go to: https://dashboard.render.com
2. Open your frontend service: **ytbsavingsfront**
3. Click **"Environment"** tab
4. Add:
   ```
   VITE_GOOGLE_CLIENT_ID: your_client_id_here
   ```
5. Click **"Save Changes"**
6. **Redeploy** the frontend service

---

## Step 3: Update Frontend Code

### File: `frontend/src/pages/Login.tsx`

Change the GoogleLogin component to use environment variable:

**BEFORE:**
```tsx
<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={() => setError('Google login failed')}
/>
```

**AFTER:**
```tsx
<GoogleLogin
  clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_client_id_here'}
  onSuccess={handleGoogleSuccess}
  onError={() => setError('Google login failed')}
/>
```

---

## Step 4: Update Google Cloud Console

Make sure these are set in Google Cloud:

### Authorized JavaScript Origins:
```
https://ytbsavingsfront.onrender.com
https://www.ytbstorage.space
http://localhost:5173 (for local testing)
```

### Authorized Redirect URIs:
```
https://ytbsavingsfront.onrender.com
https://www.ytbstorage.space
```

---

## Step 5: Test Locally First

### 1. Create `.env.local` in frontend:
```
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

### 2. Restart frontend:
```bash
cd frontend
npm run dev
```

### 3. Test Google login at: http://localhost:5173/login

---

## 🔍 Common Issues & Fixes

### "Error 400: invalid_request"
- ✅ Add correct JavaScript origins in Google Cloud
- ✅ Add correct redirect URIs in Google Cloud

### "Access blocked"
- ✅ Publish the OAuth consent screen (or add test users)
- Go to OAuth consent screen → Click **"PUBLISH APP"**
- Or add yourself as test user:
  - OAuth consent screen → **"Test users"** → Add your email

### "Token not in cache"
- ✅ Clear browser cache
- ✅ Try incognito mode

### Still not working?
1. Delete OAuth client and create new one
2. Double-check all URLs (no trailing slashes!)
3. Wait 5-10 minutes for changes to propagate

---

## 📋 Complete Setup Checklist

### Google Cloud Console:
- [ ] Project created
- [ ] OAuth consent screen configured
- [ ] Test users added (if in testing mode)
- [ ] OAuth client created
- [ ] JavaScript origins added
- [ ] Redirect URIs added
- [ ] Client ID copied

### Backend (Render):
- [ ] GOOGLE_CLIENT_ID added
- [ ] GOOGLE_CLIENT_SECRET added
- [ ] Service redeployed

### Frontend (Render):
- [ ] VITE_GOOGLE_CLIENT_ID added
- [ ] Service redeployed

### Testing:
- [ ] Google login works locally
- [ ] Google login works on production

---

## 🎯 Expected Result:

After setup, Google login should:
1. Show Google account picker
2. Ask for permissions
3. Successfully login and redirect to dashboard

---

## ⏱️ Timeline:

- Google Cloud setup: 10-15 minutes
- Render config: 2 minutes
- Redeploy: 5 minutes
- Total: ~20 minutes

---

## 🆘 Still Having Issues?

If Google login still doesn't work:

1. **Check browser console** (F12) for exact error
2. **Verify all URLs** match exactly in Google Cloud
3. **Clear cache** or use incognito
4. **Wait 10 minutes** for OAuth changes to propagate
5. **Contact Google support** through Cloud Console if needed

---

## 📞 Resources:

- Google Cloud Console: https://console.cloud.google.com
- Render Dashboard: https://dashboard.render.com
- React OAuth Google: https://github.com/MomenSherif/react-oauth

Good luck! 🚀

