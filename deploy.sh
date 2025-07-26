#!/bin/bash

# Fujifilm Recipes PWA Deploy Script
# This script builds the app and deploys it to GitHub Pages

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run this from the project root."
    exit 1
fi

# Check if recipes source directory exists
RECIPES_SOURCE="/Users/hubidubi/Library/Application Support/com.fujifilm.denji/X RAW STUDIO/X100V/X100V_0100"
if [ ! -d "$RECIPES_SOURCE" ]; then
    echo "❌ Error: Recipes source directory not found at: $RECIPES_SOURCE"
    echo "Please check the path and try again."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔧 Building recipes data..."
npm run build-recipes

echo "🔨 Building production bundle..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist directory not found"
    exit 1
fi

echo "📋 Build complete! Contents of dist:"
ls -la dist/

# Deploy to GitHub Pages using gh-pages (install if not present)
if ! command -v gh-pages &> /dev/null; then
    echo "📦 Installing gh-pages..."
    npm install -g gh-pages
fi

echo "🚀 Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app should now be available at the URL specified in your package.json homepage field."
echo "   (e.g., https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/)"
echo ""
echo "⏰ GitHub Pages may take a few minutes to update. If it doesn't appear, please check:"
echo "   1. Your GitHub repository settings -> Pages: Ensure GitHub Pages is enabled and set to deploy from the 'gh-pages' branch."
echo "   2. The 'homepage' field in your package.json: It should match your GitHub Pages URL."
echo "   3. Your browser's cache: Try clearing it or opening in an incognito window."
