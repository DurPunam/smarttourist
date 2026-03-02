# Smart Tourist Deployment Guide

## Free Deployment Options

### Option 1: Render.com (Recommended - Easiest)

**Steps:**

1. **Sign up at [Render.com](https://render.com)** using your GitHub account

2. **Create New Web Service for Backend:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `SAICHARAN1189/Smart-Tourist`
   - Configure:
     - Name: `smarttourist-backend`
     - Region: Oregon (US West)
     - Branch: `main`
     - Root Directory: `backend`
     - Runtime: Node
     - Build Command: `npm install`
     - Start Command: `node server.js`
     - Plan: Free
   
3. **Add Environment Variables for Backend:**
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `JWT_SECRET` = (generate a random string)
   - `GEMINI_API_KEY` = (your Gemini API key)

4. **Create New Static Site for Frontend:**
   - Click "New +" → "Static Site"
   - Connect same repository
   - Configure:
     - Name: `smarttourist-frontend`
     - Branch: `main`
     - Root Directory: Leave empty
     - Build Command: `npm install && npm run build`
     - Publish Directory: `dist`
     - Plan: Free

5. **Add Environment Variable for Frontend:**
   - `VITE_API_URL` = (your backend URL from step 2, e.g., `https://smarttourist-backend.onrender.com`)

6. **Update CORS in Backend:**
   - After deployment, add your frontend URL to CORS whitelist in `backend/server.js`

**Note:** Free tier sleeps after 15 minutes of inactivity. First request takes ~30 seconds to wake up.

---

### Option 2: Railway.app

**Steps:**

1. **Sign up at [Railway.app](https://railway.app)** with GitHub

2. **Deploy Backend:**
   - New Project → Deploy from GitHub
   - Select repository
   - Add service → Select `backend` folder
   - Add variables:
     - `NODE_ENV=production`
     - `JWT_SECRET=your-secret`
     - `GEMINI_API_KEY=your-key`
   - Railway auto-detects Node.js and deploys

3. **Deploy Frontend:**
   - Add service → Select root folder
   - Add variable: `VITE_API_URL=your-backend-url`
   - Railway builds and deploys

**Free tier:** $5 credit/month (enough for small projects)

---

### Option 3: Vercel (Frontend) + Render (Backend)

**Frontend on Vercel:**

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - Framework: Vite
   - Root Directory: Leave empty
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable:
   - `VITE_API_URL` = your backend URL

**Backend on Render:** Follow Option 1 steps 2-3

---

### Option 4: Netlify (Frontend) + Render (Backend)

**Frontend on Netlify:**

1. Go to [Netlify.com](https://netlify.com)
2. Add new site → Import from Git
3. Select repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variable:
   - `VITE_API_URL` = your backend URL

**Backend on Render:** Follow Option 1 steps 2-3

---

## Important Notes

### Database Considerations

- SQLite file will be reset on free tier restarts
- For production, consider:
  - **Render PostgreSQL** (free tier available)
  - **Supabase** (free PostgreSQL)
  - **MongoDB Atlas** (free tier)

### Environment Variables Needed

**Backend:**
- `NODE_ENV=production`
- `PORT=5000`
- `JWT_SECRET=your-secret-key-here`
- `GEMINI_API_KEY=your-gemini-api-key`

**Frontend:**
- `VITE_API_URL=https://your-backend-url.com`

### After Deployment

1. Update CORS settings in backend to allow your frontend domain
2. Run database initialization script to create default users
3. Test all features (login, map, IoT monitor, etc.)

---

## Quick Deploy Commands

If using Render with `render.yaml`:

```bash
# Commit the render.yaml file
git add render.yaml
git commit -m "Add Render deployment config"
git push saicharan main

# Then go to Render dashboard and create "New Blueprint Instance"
# Select your repository and it will auto-deploy both services
```

---

## Troubleshooting

**Backend not connecting:**
- Check environment variables are set
- Verify CORS settings include frontend URL
- Check logs in deployment platform

**Frontend API calls failing:**
- Verify `VITE_API_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend is running

**Database issues:**
- Run initialization scripts after deployment
- Consider migrating to PostgreSQL for persistence

---

## Cost Comparison

| Platform | Frontend | Backend | Database | Total |
|----------|----------|---------|----------|-------|
| Render | Free | Free | Free (SQLite) | $0 |
| Railway | Free | Free | Free | $0 (with $5 credit) |
| Vercel + Render | Free | Free | Free | $0 |
| Netlify + Render | Free | Free | Free | $0 |

All options are completely free for small projects!
