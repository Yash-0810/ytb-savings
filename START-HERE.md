# 🚀 Exact Steps to Get FinanceHub Running

## ⚠️ IMPORTANT: Read This First

**Your system is missing Node.js**

The error `zsh: command not found: npm` means Node.js is not installed.

---

## 3 SIMPLE STEPS

### ✅ STEP 1: Install Node.js (One-time, takes 5 minutes)

1. Open your browser (Safari, Chrome, Firefox, etc.)
2. Go to: **https://nodejs.org/**
3. You'll see two big buttons:
   - Click **"Download LTS"** (the one on the left)
4. The file will download (usually to Downloads folder)
5. **Double-click** the downloaded file named `node-vXX.X.X.pkg`
6. Follow the installer prompts:
   - Click "Continue"
   - Agree to the license
   - Click "Install"
   - Enter your Mac password if asked
   - Wait for installation to complete
   - Click "Done"

### ✅ STEP 2: Verify Node.js is Installed

**IMPORTANT: Close ALL terminals and open a NEW one**

1. Click the Terminal icon or press `Cmd + Space`, type "Terminal", press Enter
2. Copy and paste this command:
   ```
   node --version && npm --version
   ```
3. Press Enter
4. You should see two version numbers like:
   ```
   v18.19.0
   9.8.1
   ```

**If you see "command not found":**
- Node.js didn't install correctly
- Go back to Step 1 and try again

---

### ✅ STEP 3: Install and Run FinanceHub

In your terminal, copy and paste these commands one by one:

```bash
# Go to the project folder
cd /Users/yash/Coding/webistes/Saving

# Install everything automatically
chmod +x install.sh
./install.sh
```

This will install all dependencies automatically.

**Wait for it to complete** - it may take 2-5 minutes.

You'll see:
```
✅ Backend dependencies installed
✅ Frontend dependencies installed
✅ Setup Complete!
```

---

## 🎮 Run the Application

Once setup is complete, open **TWO terminals**:

### Terminal 1 - Backend:
```bash
cd /Users/yash/Coding/webistes/Saving/backend
npm run dev
```

Wait for it to show:
```
Server running on port 5000
```

### Terminal 2 - Frontend:
```bash
cd /Users/yash/Coding/webistes/Saving/frontend
npm run dev
```

Wait for it to show:
```
Local: http://localhost:5173
```

### Terminal 3 - Open Browser:
```bash
# Open your browser and go to:
http://localhost:5173
```

---

## 🔐 Login

Use these credentials:
- **Email:** `user@example.com`
- **Password:** `password123`

---

## ✨ You're Done!

If you see the login page, everything is working! 

Add some transactions and try the daily, monthly, and annual reports.

---

## 🆘 If Something Goes Wrong

### Error: "npm: command not found"
→ You missed STEP 1. Install Node.js from nodejs.org

### Error: "EACCES: permission denied"
→ Try: `sudo npm install` and enter your Mac password

### Error: "Port 5000 already in use"
→ Change PORT in `backend/.env` to something like 5001

### Frontend shows blank page
→ Check browser's Developer Console (F12 or Cmd+Option+I) for error messages

### Database error
→ Delete the file `finance.db` and restart the backend

---

## 📚 Need More Help?

- **INSTALLATION-GUIDE.md** - Detailed installation steps
- **QUICK-FIX.md** - Troubleshooting common issues
- **README.md** - Project overview
- **SETUP.md** - Full setup instructions

---

**Good luck! Your FinanceHub is ready to use! 💰**

