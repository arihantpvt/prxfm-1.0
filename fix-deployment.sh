#!/bin/bash

echo "🔧 Fixing PRXFM Deployment Configuration..."

# Check if we're in the right directory
if [ ! -f "server/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "Current directory: $(pwd)"
    echo "Expected files: server/package.json should exist"
    exit 1
fi

echo "✅ Found server directory"

# Check server structure
echo "📁 Checking server structure..."
if [ -f "server/index.js" ]; then
    echo "✅ Found server/index.js"
else
    echo "❌ Missing server/index.js"
    exit 1
fi

if [ -f "server/package.json" ]; then
    echo "✅ Found server/package.json"
else
    echo "❌ Missing server/package.json"
    exit 1
fi

# Check if express is installed
echo "📦 Checking server dependencies..."
cd server
if npm list express > /dev/null 2>&1; then
    echo "✅ Express is installed"
else
    echo "❌ Express not found, installing..."
    npm install
fi

cd ..

echo ""
echo "🎯 Render.com Configuration:"
echo "================================"
echo "Root Directory: server"
echo "Build Command: npm install"
echo "Start Command: npm start"
echo "Environment: Node"
echo ""
echo "Environment Variables needed:"
echo "- NODE_ENV=production"
echo "- MONGODB_URI=your-mongodb-connection-string"
echo "- JWT_SECRET=your-secret-key"
echo "- PORT=10000"
echo ""
echo "Health Check Path: /api/health"
echo ""
echo "🚀 Ready to deploy with correct settings!"
echo "Follow RENDER_SETUP.md for detailed instructions."
