# Quick Fix Guide - FinanceHub

## 🔴 Current Issue
- Node.js is NOT installed on your system
- npm is NOT available
- Cannot install dependencies

## ✅ Solution

### Step 1: Install Node.js (REQUIRED)

**For macOS:**

Since `brew` is not installed, use the official Node.js installer:

1. **Open your browser** and go to: https://nodejs.org/
2. **Download the LTS version** (Long Term Support)
3. **Run the installer** on your Mac
4. **Accept all defaults** and complete installation
5. **Close your terminal** completely
6. **Open a NEW terminal** (important!)

### Step 2: Verify Installation

In your NEW terminal, run:
```bash
node --version
npm --version
```

You should see version numbers like:
- node: v18.x.x or higher
- npm: 9.x.x or higher

**If you see "command not found":**
- Node.js was not installed correctly
- Try downloading again from nodejs.org
- Make sure you ran the installer

### Step 3: Install Project Dependencies

Once Node.js is working:

```bash
# Go to project folder
cd /Users/yash/Coding/webistes/Saving

# Make setup script executable
chmod +x install.sh

# Run automatic setup
./install.sh
```

Or manually:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 4: Start the Application

In **Terminal 1**:
```bash
cd backend
npm run dev
```

In **Terminal 2** (new terminal window):
```bash
cd frontend
npm run dev
```

Then open: http://localhost:5173

---

## 🎯 What Gets Fixed

✅ All TypeScript errors will be resolved  
✅ All missing modules will be installed  
✅ Frontend will compile properly  
✅ Backend will start correctly  
✅ Database will initialize  

---

## 🆘 If Problems Persist

### Error: "command not found: npm"
→ Node.js is not installed. Go back to Step 1 and use the official installer.

### Error: "Cannot find module"
→ Dependencies not installed. Run: `npm install`

### Error: "Port 5000 in use"
→ Change PORT in backend/.env or kill the process using port 5000

### Frontend shows blank page
→ Wait for compilation to finish, check browser console for errors

### Database errors
→ Delete `finance.db` file and restart backend

---

## 📝 Important Notes

1. **Node.js is NOT Homebrew**
   - Homebrew is a package manager
   - Node.js is a runtime environment
   - Download Node.js directly from nodejs.org

2. **Use NEW terminal after installing Node.js**
   - Close all terminals
   - Open a fresh terminal
   - Run commands in the new terminal

3. **Follow the exact steps**
   - Don't skip any steps
   - Read error messages carefully
   - Use the provided scripts

---

## ✨ After Everything Works

Once you see:
- "Server running on port 5000" in Terminal 1
- "Local: http://localhost:5173" in Terminal 2

Your application is ready! Open http://localhost:5173 in your browser.

---

**Need help?**
- Check INSTALLATION-GUIDE.md for detailed steps
- See README.md for feature overview
- Check SETUP.md for troubleshooting

