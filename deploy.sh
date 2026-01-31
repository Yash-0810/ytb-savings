#!/bin/bash

# GitHub Deployment Script for YTB Savings
# Run this script after creating the GitHub repository

echo "🚀 YTB Savings - GitHub Deployment Script"
echo "=========================================="

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized. Running: git init"
    git init
    git branch -M main
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Create commit
echo "💾 Creating commit..."
read -p "Enter commit message (default: 'YTB Savings - Financial Management App'): " commit_msg
commit_msg=${commit_msg:-"YTB Savings - Financial Management App"}
git commit -m "$commit_msg"

# Set remote (if not already set)
if ! git remote get-url origin >/dev/null 2>&1; then
    echo "🔗 Setting up GitHub remote..."
    read -p "Enter your GitHub username: " github_username
    read -p "Enter repository name (default: ytb-savings): " repo_name
    repo_name=${repo_name:-"ytb-savings"}
    git remote add origin "https://github.com/$github_username/$repo_name.git"
    echo "✅ Remote set to: https://github.com/$github_username/$repo_name.git"
else
    echo "✅ Remote already set: $(git remote get-url origin)"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "Next steps:"
echo "1. Go to https://github.com/Yash-0810/ytb-savings"
echo "2. Deploy backend to Render.com (see DEPLOYMENT.md)"
echo "3. Deploy frontend to Vercel"
echo ""

