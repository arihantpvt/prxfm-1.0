# 🚀 Render.com Setup Guide

## Fix for "Cannot find module" Error

The error `Cannot find module '/opt/render/project/src/server/server/index.js'` happens because Render is configured with the wrong root directory.

## ✅ Correct Render Configuration

### Backend Service Settings:

1. **Go to Render Dashboard**
2. **Delete the current service** (if it exists)
3. **Create New Web Service**
4. **Connect your GitHub repository**
5. **Use these EXACT settings:**

```
Name: prxfm-backend
Environment: Node
Root Directory: server
Build Command: npm install
Start Command: npm start
```

### Environment Variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prxfm-couple-app
JWT_SECRET=your-super-secret-jwt-key-here
PORT=10000
```

### Health Check:

```
Health Check Path: /api/health
```

## 🔧 Alternative: Use Blueprint (Recommended)

1. **Push your code to GitHub** (make sure `render.yaml` is included)
2. **In Render Dashboard**, click "New +" → "Blueprint"
3. **Connect your GitHub repository**
4. **Render will automatically use the `render.yaml` configuration**

## 📁 Correct File Structure

Your GitHub repo should have this structure:

```
prxfm/
├── server/
│   ├── index.js
│   ├── package.json
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── client/
│   ├── src/
│   ├── package.json
│   └── public/
├── render.yaml
├── package.json
└── README.md
```

## 🚨 Common Mistakes to Avoid:

❌ **Wrong Root Directory**: Don't use `src/server` or `server/server`
✅ **Correct Root Directory**: Use `server`

❌ **Wrong Build Command**: Don't use `cd server && npm install`
✅ **Correct Build Command**: Use `npm install` (when root dir is `server`)

❌ **Wrong Start Command**: Don't use `cd server && npm start`
✅ **Correct Start Command**: Use `npm start` (when root dir is `server`)

## 🔍 Debug Steps:

1. **Check your Render service settings**
2. **Make sure Root Directory is exactly**: `server`
3. **Make sure Build Command is exactly**: `npm install`
4. **Make sure Start Command is exactly**: `npm start`
5. **Check that all environment variables are set**

## 📞 If Still Having Issues:

1. **Delete the Render service completely**
2. **Start fresh with the correct settings above**
3. **Or use the Blueprint method with `render.yaml`**

The key is making sure Render knows your server files are in the `server/` directory, not `src/server/`!
