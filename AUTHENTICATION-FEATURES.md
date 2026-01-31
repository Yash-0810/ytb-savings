# FinanceHub - New Authentication Features

This guide explains how to set up and use the three new authentication features added to FinanceHub:
1. **Google OAuth Login** - Sign in with your Google account
2. **OTP Email Verification** - Verify new email signups with a 6-digit OTP
3. **Password Reset via Email** - Reset forgotten passwords via Gmail

## Setup Instructions

### 1. Backend Gmail Configuration

To enable email sending for OTP and password reset, you need to configure Gmail:

#### Step 1: Enable 2-Step Verification
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification (if not already enabled)

#### Step 2: Create an App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer" (or your device)
3. Google will generate a 16-character password
4. Copy this password

#### Step 3: Update Backend .env
Edit `/Saving/backend/.env`:
```env
GMAIL_EMAIL=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
FRONTEND_URL=http://localhost:5173
```

### 2. Frontend Google OAuth Setup

To enable Google login, you need a Google OAuth Client ID:

#### Step 1: Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth Client ID**
5. Select **Web application**
6. Add Authorized Redirect URIs:
   - `http://localhost:5173`
   - `http://localhost:5173/login`
   - `http://localhost:5173/signup`
7. Copy your **Client ID**

#### Step 2: Update Frontend .env
Edit `/Saving/frontend/.env`:
```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. Backend Database Setup

The new features require three new database tables. These are **automatically created** on first run:
- `otp_verifications` - Stores OTP codes for email verification
- `password_reset_tokens` - Stores password reset tokens
- Updated `users` table with fields: `google_id`, `is_verified`

## Features Overview

### Feature 1: Google OAuth Login

**User Flow:**
1. User clicks "Login with Google" on Login or Signup page
2. Google popup appears for authentication
3. User selects their Google account
4. Account is automatically created or linked if it exists
5. User is logged in and redirected to dashboard

**API Endpoint:**
```
POST /api/auth/google
Body: { googleId, email, name, picture }
Response: { token, user }
```

### Feature 2: OTP Email Verification for Signup

**User Flow:**
1. User fills signup form with email, name, and password
2. System sends a 6-digit OTP to the email
3. User receives email with OTP (expires in 10 minutes)
4. User enters OTP on the verification page
5. Account is created and user is logged in

**API Endpoints:**
```
POST /api/auth/signup
Body: { email, name, password }
Response: { message, requiresOTP: true, email }

POST /api/auth/verify-otp
Body: { email, otp, name, password }
Response: { token, user }
```

### Feature 3: Password Reset via Email

**User Flow:**
1. User clicks "Forgot password?" on login page
2. User enters email address
3. System sends password reset link to email
4. User clicks link (valid for 1 hour) to open reset page
5. User enters new password
6. Password is updated and user can login with new password

**API Endpoints:**
```
POST /api/auth/forgot-password
Body: { email }
Response: { message: "If email exists, a reset link has been sent" }

POST /api/auth/reset-password
Body: { token, newPassword }
Response: { message: "Password reset successfully" }
```

## Running the Application

### Terminal 1: Start Backend
```bash
cd /Users/yash/Coding/webistes/Saving/backend
npm run dev
```

### Terminal 2: Start Frontend
```bash
cd /Users/yash/Coding/webistes/Saving/frontend
npm run dev
```

### Terminal 3: Open in Browser
```
http://localhost:5173
```

## Testing the Features

### Test Google Login
1. Go to http://localhost:5173/login or /signup
2. Click "Login with Google" or Google button
3. Select a Google account
4. You should be logged in

### Test OTP Verification
1. Go to http://localhost:5173/signup
2. Fill in name, email, and password
3. Click "Sign Up"
4. Check the console output (OTP is logged) or check email for OTP
5. Enter the OTP code
6. Account should be created

### Test Password Reset
1. Go to http://localhost:5173/login
2. Click "Forgot password?"
3. Enter email address
4. Check console or email for reset link
5. Click link to reset password page
6. Enter new password and confirm
7. Password should be reset

## Email Testing

During development, OTP and password reset links are logged to the console. In production, they are sent via Gmail.

**Console Output Example:**
```
OTP sent to user@example.com
Password reset email sent to user@example.com
```

## Troubleshooting

### Gmail not sending emails
- Verify `.env` has correct `GMAIL_EMAIL` and `GMAIL_APP_PASSWORD`
- Check that 2-Step Verification is enabled on the Gmail account
- Verify the app password is 16 characters (space included)
- Check backend logs for detailed error messages

### Google login not working
- Verify `.env` has correct `REACT_APP_GOOGLE_CLIENT_ID`
- Check that redirect URIs in Google Cloud Console match your domain
- Ensure frontend is running on the configured port

### OTP not received
- OTP is logged to console during development
- Check email spam folder
- Verify email address is correct
- OTP expires after 10 minutes

### Reset link not working
- Links expire after 1 hour
- Verify `FRONTEND_URL` in `.env` is correct
- Check that you're using the exact URL from the email

## Database Schema

### otp_verifications table
```sql
CREATE TABLE otp_verifications (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### password_reset_tokens table
```sql
CREATE TABLE password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

### users table (updated)
```sql
ALTER TABLE users ADD google_id TEXT UNIQUE;
ALTER TABLE users ADD is_verified BOOLEAN DEFAULT 0;
ALTER TABLE users MODIFY password TEXT (now nullable for Google-only accounts);
```

## Security Notes

- Passwords are hashed using bcryptjs (10 salt rounds)
- OTP codes are 6 digits and expire in 10 minutes
- Reset tokens are 64-character hex strings and expire in 1 hour
- JWT tokens use the `JWT_SECRET` from `.env`
- Google OAuth integrates with official Google authentication

## Support

For issues or questions, check:
- Backend console logs
- Frontend browser console (F12)
- Email spam folders
- `.env` file configuration
