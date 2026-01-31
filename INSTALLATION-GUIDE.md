# Installation Guide for FinanceHub

## 🚀 Step 1: Install Node.js (Required)

Since Homebrew is not available on your system, use the official installer:

### For macOS:
1. Visit: https://nodejs.org/
2. Click "Download LTS" (Long Term Support)
3. Save the `.pkg` file
4. Double-click the installer and follow the prompts
5. Complete the installation

### Verify Installation:
After installation, open a new Terminal and run:
```bash
node --version
npm --version
```

Both should show version numbers (e.g., v18.x.x, 9.x.x)

---

## 📦 Step 2: Install Project Dependencies

Once Node.js is installed, navigate to the project and install all dependencies:

```bash
# Navigate to project directory
cd /Users/yash/Coding/webistes/Saving

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

This will:
- ✅ Download all required packages from npm
- ✅ Install TypeScript compiler
- ✅ Install React, Vite, Tailwind CSS
- ✅ Install Express, better-sqlite3
- ✅ Install all other dependencies

---

## 🔧 Step 3: Fix Any Remaining Issues

### If you see "Cannot find module" errors:
```bash
cd backend
npm install better-sqlite3 --save
cd ../frontend
npm install
```

### If you see TypeScript errors:
```bash
cd frontend
npm install --save-dev typescript @types/react @types/react-dom
```

---

## ✅ Verify Everything Works

After installation, test that everything is installed:

```bash
# In backend directory
cd backend
npm run dev
# Should show: "Server running on port 5000"

# In frontend directory (new terminal)
cd frontend
npm run dev
# Should show: "Local: http://localhost:5173"
```

---

## 🆘 Troubleshooting

### If npm install fails:
1. Delete node_modules and package-lock.json:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

2. Try installing specific packages:
```bash
npm install express cors dotenv jwt-simple bcryptjs better-sqlite3
```

### If you still get errors:
1. Check Node.js version: `node --version` (should be 18+)
2. Check npm version: `npm --version` (should be 8+)
3. Delete entire node_modules and try fresh install

---

## 📝 What Gets Installed

### Backend Dependencies:
- express (Web framework)
- better-sqlite3 (Database)
- bcryptjs (Password hashing)
- jwt-simple (Authentication tokens)
- cors (Cross-origin requests)
- dotenv (Environment variables)

### Frontend Dependencies:
- react (UI framework)
- typescript (Type checking)
- vite (Build tool)
- tailwind-css (Styling)
- react-router-dom (Navigation)
- axios (HTTP client)

---

## 🎯 Next Steps

1. Install Node.js from nodejs.org
2. Run `npm install` in both backend and frontend directories
3. Start the application as described in README.md
4. Report any specific error messages if issues persist

**Important:** Without Node.js installed, npm won't work and you won't be able to install any dependencies!

