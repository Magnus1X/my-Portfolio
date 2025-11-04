# Deployment Guide

## Prerequisites
- MongoDB Atlas account
- Cloudinary account  
- Render account
- GitHub repository

## 1. Setup Services

### MongoDB Atlas
1. Create cluster at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create database user
3. Whitelist all IPs (0.0.0.0/0)
4. Get connection string

### Cloudinary
1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get cloud name, API key, and API secret from dashboard

## 2. Deploy on Render

### Backend
1. Connect GitHub repo to Render
2. Create Web Service
3. Set environment variables:
   ```
   DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/portfolio_db
   JWT_SECRET=your-secure-secret
   ADMIN_EMAIL=your-email@gmail.com
   ADMIN_PASSWORD=secure-password
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=gmail-app-password
   EMAIL_FROM=your-gmail@gmail.com
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   NODE_ENV=production
   ```

### Frontend
1. Create Static Site on Render
2. Set build command: `cd frontend && npm install && npm run build`
3. Set publish directory: `frontend/dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

## 3. Initialize Database
After backend deployment, run in Render shell:
```bash
npm run db:seed
```

## 4. Gmail Setup
1. Enable 2FA on Gmail
2. Generate App Password
3. Use app password in EMAIL_PASS

Your portfolio will be live at your Render URLs!