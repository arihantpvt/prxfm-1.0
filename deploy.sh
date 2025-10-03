#!/bin/bash

# PRXFM Deployment Script
echo "🚀 Deploying PRXFM Couple App..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Check if servers can start locally
echo "🔍 Testing local servers..."

# Test backend
echo "Testing backend..."
cd server
if npm start &> /dev/null & then
    BACKEND_PID=$!
    sleep 3
    if curl -s http://localhost:5001/api/health > /dev/null; then
        echo "✅ Backend server is working"
    else
        echo "❌ Backend server failed to start"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    kill $BACKEND_PID 2>/dev/null
else
    echo "❌ Failed to start backend server"
    exit 1
fi

cd ..

# Test frontend build
echo "Testing frontend build..."
cd client
if npm run build &> /dev/null; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

cd ..

echo "🎉 All tests passed! Ready for deployment."
echo ""
echo "📋 Deployment Checklist:"
echo "1. ✅ Dependencies installed"
echo "2. ✅ Backend server working"
echo "3. ✅ Frontend builds successfully"
echo ""
echo "🚀 Ready to deploy to Render.com!"
echo "Follow the DEPLOYMENT.md guide for detailed instructions."
