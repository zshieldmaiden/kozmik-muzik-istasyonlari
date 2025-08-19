#!/bin/bash

# Production build için environment variables
export NODE_ENV=production

# Frontend build
echo "🚀 Building frontend..."
npm run build

echo "✅ Build completed!"
echo "📁 Files ready in ./dist/"

# Backend için ayrı package.json kontrol
if [ -d "server" ]; then
    echo "🔧 Backend detected, checking dependencies..."
    cd server
    if [ -f "package.json" ]; then
        npm install
        echo "✅ Backend dependencies installed"
    fi
    cd ..
fi

echo "🎵 Ready for Render deployment!"
