# Fix OTP Email & Google OAuth Issues

## Problem 1: OTP Not Sending

The backend needs Gmail credentials to send OTPs. Add these to **Render Dashboard → ytb-savings (backend)**:

### Environment Variables (Backend):

| Key | Value |
|-----|-------|
| GMAIL_EMAIL | your@gmail.com |
| GMAILxxxxxxxxxxxxxxx (_APP_PASSWORD | x16 chars) |

### How to Get Gmail App Password:
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification" (if not already enabled)
3. Search "App Passwords" in the search bar
4. Create new app password named "FinanceHub"
5. Copy the 16-character password

---

## Problem 2: Google OAuth Not Working

### Step 1: Add to Render Frontend
Go to **Render Dashboard → ytbsavingsfront (frontend)**:

| Key | Value |
|-----|-------|
| VITE_GOOGLE_CLIENT_ID | your_client_id.apps.googleusercontent.com |

### Step 2: Update Google Cloud Console
1. Go to https://console.cloud.google.com/
2. Navigate to APIs & Credentials → OAuth 2.0 Client IDs
3. Edit your OAuth client
4. Add to **Authorized JavaScript origins:**
   - `https://ytbsavingsfront.onrender.com`
   - `https://ytbstorage.space`
5. Add to **Authorized redirect URIs:**
   - `https://ytbsavingsfront.onrender.com`
   - `https://ytbstorage.space`

---

## Step 3: Redeploy Services
After adding all environment variables:
1. Go to Render Dashboard
2. Click "Deploy" on both frontend and backend services
3. Wait for deployment to complete

---

## Step 4: Test
Visit https://ytbstorage.space and try:
1. Signup with email (should receive OTP)
2. Signup with Google (should work)

---

## If Issues Persist:
Check Render logs:
1. Render Dashboard → ytb-savings → Logs
2. Look for error messages about email sending or OAuth

