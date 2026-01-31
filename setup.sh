#!/bin/bash

# FinanceHub - Quick Start Script
# This script automates the setup process

echo "🚀 FinanceHub - Financial Management Application"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please download and install from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"
cd ..

echo ""
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"
cd ..

echo ""
echo "=================================================="
echo "✅ Setup Complete!"
echo "=================================================="
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Start the Backend (Terminal 1):"
echo "   cd backend && npm run dev"
echo ""
echo "2. Start the Frontend (Terminal 2):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:5173"
echo ""
echo "4. Login with:"
echo "   Email: user@example.com"
echo "   Password: password123"
echo ""
echo "📖 For more information, see SETUP.md"
echo ""
