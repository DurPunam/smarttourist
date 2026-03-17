# Quick Start: Deploy to Render.com

## 🎯 Simple 3-Step Process

### Step 1: Create PostgreSQL Database (5 minutes)
1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in:
   - Name: `smarttourist-db`
   - Region: `Oregon (US West)` or closest to you
   - Plan: **Free**
4. Click **"Create Database"**
5. **Copy the "Internal Database URL"** (looks like: `postgresql://user:pass@host/db`)

---

### Step 2: Deploy Backend (10 minutes)
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo
3. Fill in:
   - Name: `smarttourist-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<paste-your-database-url-from-step-1>
   JWT_SECRET=your-secret-key-min-32-chars
   CORS_ORIGIN=https://your-frontend-url.onrender.com
   ```
5. Click **"Create Web Service"**
6. Wait 5-10 minutes for deployment
7. **Copy your backend URL**: `https://smarttourist-backend.onrender.com`

---

### Step 3: Deploy Frontend (5 minutes)
1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repo
3. Fill in:
   - Name: `smarttourist-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://smarttourist-backend.onrender.com
   ```
5. Click **"Create Static Site"**
6. Wait 3-5 minutes
7. **Your app is live!** 🎉

---

## ✅ Done!

Your app is now deployed with:
- ✅ PostgreSQL database (data persists forever)
- ✅ Backend API (Node.js + Express)
- ✅ Frontend (React + Vite)

**Test it**: Visit your frontend URL and try logging in!

---

## 📝 Important URLs to Save

After deployment, save these:
- **Frontend**: `https://smarttourist-frontend.onrender.com`
- **Backend**: `https://smarttourist-backend.onrender.com`
- **Database**: (Internal URL - keep secret!)

---

## 🔧 Update Backend CORS (Important!)

After frontend is deployed:
1. Go to backend service → **"Environment"** tab
2. Update `CORS_ORIGIN` with your actual frontend URL
3. Click **"Save Changes"**
4. Backend will auto-redeploy

---

## 🐛 Common Issues

### Backend won't start?
- Check logs: Backend service → **"Logs"** tab
- Verify `DATABASE_URL` is set correctly

### Frontend shows connection error?
- Update `VITE_API_URL` with correct backend URL
- Check backend is running (green status)

### CORS error?
- Update `CORS_ORIGIN` in backend environment variables
- Make sure URLs don't have trailing slashes

---

## 💰 Cost

**Free Tier:**
- Database: Free (1GB storage)
- Backend: Free (spins down after 15 min)
- Frontend: Free (100GB bandwidth)
- **Total: $0/month**

---

## 📚 Need More Help?

- Detailed guide: See `RENDER_DEPLOYMENT.md`
- PostgreSQL setup: See `HOW_TO_CREATE_POSTGRES_RENDER.md`
- Render docs: https://render.com/docs

---

That's it! Your Tourist Safety Platform is now live! 🚀
