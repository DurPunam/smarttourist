# Deploy to Render.com with PostgreSQL

## Why PostgreSQL?
SQLite stores data in a file that gets deleted when Render restarts your container. PostgreSQL is a persistent database that keeps your data safe even after restarts.

## Step-by-Step Deployment

### 1. Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in the details:
   - **Name**: `smarttourist-db` (or any name you like)
   - **Database**: `smarttourist`
   - **User**: `smarttourist_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free (or paid for better performance)
4. Click **"Create Database"**
5. Wait for it to be created (takes 1-2 minutes)
6. **Copy the "Internal Database URL"** - you'll need this!

### 2. Deploy Backend (Node.js API)

1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Fill in the details:
   - **Name**: `smarttourist-backend`
   - **Region**: Same as database
   - **Branch**: `main` (or your branch name)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid)

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
   JWT_EXPIRE=7d
   DATABASE_URL=<paste-internal-database-url-from-step-1>
   GEMINI_API_KEY=your-gemini-api-key
   CORS_ORIGIN=https://your-frontend-url.onrender.com
   WS_CORS_ORIGIN=https://your-frontend-url.onrender.com
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. **Copy your backend URL**: `https://smarttourist-backend.onrender.com`

### 3. Deploy Frontend (React/Vite)

1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Fill in the details:
   - **Name**: `smarttourist-frontend`
   - **Branch**: `main`
   - **Root Directory**: Leave empty (root of repo)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. **Add Environment Variable**:
   ```
   VITE_API_URL=https://smarttourist-backend.onrender.com
   ```

6. Click **"Create Static Site"**
7. Wait for deployment (3-5 minutes)
8. **Copy your frontend URL**: `https://smarttourist-frontend.onrender.com`

### 4. Update Backend CORS

1. Go to your backend service on Render
2. Go to **"Environment"** tab
3. Update these variables with your actual frontend URL:
   ```
   CORS_ORIGIN=https://smarttourist-frontend.onrender.com
   WS_CORS_ORIGIN=https://smarttourist-frontend.onrender.com
   ```
4. Click **"Save Changes"**
5. Backend will automatically redeploy

### 5. Initialize Database

After deployment, your database tables will be created automatically when the backend starts!

To create a default admin user, you can:
1. Use the `/api/init` endpoint (if you have one)
2. Or manually create via Render Shell:
   - Go to backend service → **"Shell"** tab
   - Run: `node scripts/createDefaultUser.js`

## Important Notes

### Free Tier Limitations
- **Backend**: Spins down after 15 minutes of inactivity (first request takes 30-60 seconds)
- **Database**: 90 days of inactivity before deletion
- **Frontend**: Always fast (static files)

### Database Persistence
✅ **PostgreSQL keeps your data** even when:
- Backend restarts
- You redeploy
- Render restarts the container
- Server goes down

❌ **SQLite loses data** because the file is deleted on restart

### Monitoring
- Check logs: Service → **"Logs"** tab
- Check database: Database → **"Info"** tab → **"Connect"**

## Troubleshooting

### Backend won't start
- Check logs for errors
- Verify `DATABASE_URL` is set correctly
- Make sure all environment variables are set

### Database connection failed
- Verify you're using the **Internal Database URL** (not External)
- Check if database is running (green status)
- Ensure backend and database are in the same region

### CORS errors
- Update `CORS_ORIGIN` with your actual frontend URL
- Make sure there's no trailing slash in URLs
- Redeploy backend after changing CORS settings

### Data not persisting
- Verify you're using PostgreSQL (not SQLite)
- Check `NODE_ENV=production` is set
- Verify `DATABASE_URL` environment variable exists

## Testing Your Deployment

1. **Test Backend**: Visit `https://your-backend.onrender.com/health`
   - Should return: `{"status":"OK"}`

2. **Test Database**: Check backend logs for:
   - `✅ PostgreSQL database connection established successfully`

3. **Test Frontend**: Visit your frontend URL
   - Should load the login page
   - Try logging in

4. **Test Data Persistence**:
   - Create a user/tourist
   - Restart backend service (Settings → Manual Deploy → Deploy latest commit)
   - Check if data is still there ✅

## Cost Estimate

**Free Tier (Good for testing):**
- PostgreSQL: Free (256MB storage, 1GB RAM)
- Backend: Free (512MB RAM, spins down after 15 min)
- Frontend: Free (100GB bandwidth/month)
- **Total: $0/month**

**Paid Tier (Production ready):**
- PostgreSQL: $7/month (1GB storage, 1GB RAM)
- Backend: $7/month (512MB RAM, always on)
- Frontend: Free
- **Total: $14/month**

## Next Steps

After deployment:
1. Test all features thoroughly
2. Set up monitoring/alerts
3. Configure custom domain (optional)
4. Set up automated backups (paid plans)
5. Add SSL certificate (automatic on Render)

Your app is now live with persistent PostgreSQL database! 🎉
