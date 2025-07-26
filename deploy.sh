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
echo "🌐 Your app will be available at:"
echo "   https://YOUR_USERNAME.github.io/fujifilm-recipes-pwa/"
echo ""
echo "⏰ GitHub Pages may take a few minutes to update."
echo "💡 Make sure to:"
echo "   1. Enable GitHub Pages in your repository settings"
echo "   2. Set source to 'gh-pages branch'"
echo "   3. Update the base URL in vite.config.ts if your repo name is different"