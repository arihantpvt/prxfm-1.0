# 🚀 PRXFM Deployment Guide

## Render.com Deployment

### Backend Deployment

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure the following settings:**

#### Build & Deploy Settings:
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Environment**: `Node`

#### Environment Variables:
```
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key
PORT=10000
```

#### Health Check:
- **Health Check Path**: `/api/health`

### Frontend Deployment

1. **Create a new Static Site on Render**
2. **Connect your GitHub repository**
3. **Configure the following settings:**

#### Build & Deploy Settings:
- **Build Command**: `cd client && npm install && npm run build`
- **Publish Directory**: `client/build`

#### Environment Variables:
```
REACT_APP_API_URL=https://prxfm-1-0.onrender.com
```

### MongoDB Atlas Setup

1. **Create MongoDB Atlas account**
2. **Create a new cluster**
3. **Get connection string**
4. **Add to environment variables**

### Alternative: Vercel + Render

#### Frontend (Vercel):
1. **Connect GitHub to Vercel**
2. **Set Root Directory**: `client`
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`
5. **Environment Variable**: `REACT_APP_API_URL=https://your-backend.onrender.com/api`

#### Backend (Render):
1. **Follow backend deployment steps above**

## Local Development

```bash
# Install dependencies
npm run install-all

# Start development servers
npm run dev
```

## Environment Variables

Create `.env` file in `server/` directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prxfm-couple-app
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5001
NODE_ENV=development
```

## Troubleshooting

### Common Issues:

1. **Module not found**: Make sure dependencies are installed
2. **Database connection**: Check MongoDB Atlas connection string
3. **CORS issues**: Backend should allow frontend domain
4. **Environment variables**: Make sure all required vars are set

### Debug Commands:

```bash
# Check if servers are running
curl http://localhost:5001/api/health
curl http://localhost:3000

# Check logs
npm run dev
```
