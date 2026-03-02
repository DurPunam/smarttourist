# Quick Deploy to Render.com (5 Minutes)

## Step 1: Prepare Your Repository

```bash
# Commit deployment files
git add .
git commit -m "Add deployment configuration"
git push saicharan main
```

## Step 2: Deploy on Render.com

1. **Go to [Render.com](https://render.com)** and sign up with GitHub

2. **Click "New +" → "Blueprint"**

3. **Connect Repository:**
   - Select `SAICHARAN1189/Smart-Tourist`
   - Click "Connect"

4. **Render will auto-detect `render.yaml` and create:**
   - Backend service (Node.js)
   - Frontend service (Static site)

5. **Add Your API Key:**
   - Go to Backend service → Environment
   - Add: `GEMINI_API_KEY` = `your-actual-api-key`
   - Click "Save Changes"

6. **Wait 5-10 minutes** for deployment to complete

7. **Your app is live!**
   - Frontend: `https://smarttourist-frontend.onrender.com`
   - Backend: `https://smarttourist-backend.onrender.com`

## Step 3: Initialize Database

After deployment, run this once:

```bash
# SSH into backend or use Render shell
cd backend
node scripts/createDefaultUser.js
```

Or use the Render dashboard → Shell tab

## Step 4: Test Your Deployment

1. Visit your frontend URL
2. Login with:
   - Admin: `admin@touristsafety.gov.in` / `admin123`
   - Tourist: `tourist@example.com` / `tourist123`

## Done! 🎉

Your app is now live and accessible from anywhere!

---

## Alternative: Manual Deployment (If Blueprint Fails)

### Deploy Backend:

1. New + → Web Service
2. Connect GitHub repo
3. Settings:
   - Name: `smarttourist-backend`
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `node server.js`
   - Add environment variables

### Deploy Frontend:

1. New + → Static Site
2. Connect GitHub repo
3. Settings:
   - Name: `smarttourist-frontend`
   - Build: `npm install && npm run build`
   - Publish: `dist`
   - Add `VITE_API_URL` with backend URL

---

## Important Notes

- **Free tier sleeps after 15 min** - First request takes 30 seconds
- **Database resets on restart** - Consider PostgreSQL for production
- **Update CORS** - Add your frontend URL to backend CORS settings

## Need Help?

Check `DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.
