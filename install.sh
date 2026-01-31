#!/bin/bash

# FinanceHub - Complete Setup Script
# Run this AFTER installing Node.js from nodejs.org

echo "========================================"
echo "🚀 FinanceHub - Complete Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is NOT installed"
    echo ""
    echo "Please install Node.js first:"
    echo "1. Visit: https://nodejs.org/"
    echo "2. Download the LTS version"
    echo "3. Run the installer and complete installation"
    echo "4. Open a NEW terminal and run this script again"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Navigate to backend
echo "📦 Installing Backend Dependencies..."
cd "$(dirname "$0")/backend" || exit 1

# Clean install
rm -rf node_modules package-lock.json 2>/dev/null
npm install

if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
echo "✅ Backend dependencies installed"
echo ""

# Navigate to frontend
echo "📦 Installing Frontend Dependencies..."
cd "$(dirname "$0")/frontend" || exit 1

# Clean install
rm -rf node_modules package-lock.json 2>/dev/null
npm install

if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

echo "========================================"
echo "✅ Setup Complete!"
echo "========================================"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1️⃣  Start the Backend (Terminal 1):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2️⃣  Start the Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3️⃣  Open your browser:"
echo "   http://localhost:5173"
echo ""
echo "4️⃣  Login with:"
echo "   Email: user@example.com"
echo "   Password: password123"
echo ""
echo "📖 For more info, see SETUP.md"
echo ""
