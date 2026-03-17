# Update Existing Deployment to Use PostgreSQL

## You Already Have:
- ✅ Frontend deployed on Render
- ✅ Backend deployed on Render
- ✅ PostgreSQL database created
- ✅ Database URLs (Internal & External)

## What We Need to Do:
Just add the `DATABASE_URL` to your existing backend!

---

## 🔧 Step 1: Update Backend Environment Variables (5 min)

1. Go to: https://dashboard.render.com/
2. Find your **backend service** (click on it)
3. Click **"Environment"** tab on the left
4. Click **"Add Environment Variable"** button
5. Add this variable:
   ```
   Key: DATABASE_URL
   Value: <paste-your-INTERNAL-database-url-here>
   ```
6. Click **"Save Changes"**
7. Backend will automatically redeploy (takes 3-5 minutes)

---

## 🔍 Step 2: Verify It's Working

### Check Logs:
1. Go to your backend service
2. Click **"Logs"** tab
3. Look for this message:
   ```
   ✅ PostgreSQL database connection established successfully
   ```

### If you see this instead:
```
✅ SQLite database connection established successfully
```
**Problem**: `DATABASE_URL` is not set correctly

**Solution**: 
- Make sure you used the **INTERNAL** Database URL (not external)
- Check for typos
- Make sure `NODE_ENV=production` is set

---

## 🎯 Step 3: Test Data Persistence

1. Visit your frontend
2. Log in
3. Create a test tourist or device
4. Go to backend service on Render
5. Click **"Manual Deploy"** → **"Deploy latest commit"**
6. Wait for restart (2-3 min)
7. Check if your test data is still there ✅

**If data is gone**: Still using SQLite (check DATABASE_URL)
**If data is there**: PostgreSQL working! 🎉

---

## 📋 Required Environment Variables

Make sure your backend has ALL of these:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=<your-internal-database-url>
JWT_SECRET=<your-secret-key>
JWT_EXPIRE=7d
CORS_ORIGIN=<your-frontend-url>
WS_CORS_ORIGIN=<your-frontend-url>
```

---

## 🐛 Troubleshooting

### Backend won't start after adding DATABASE_URL?

**Check logs for errors:**
- "SSL connection required" → Database URL is correct, SSL is working
- "Connection refused" → Using external URL instead of internal
- "Authentication failed" → Wrong password in URL

**Solution**: Double-check you copied the **INTERNAL** Database URL

### Still seeing SQLite in logs?

**Possible causes:**
1. `NODE_ENV` is not set to `production`
2. `DATABASE_URL` has a typo
3. Environment variables not saved

**Solution**: 
- Verify all environment variables
- Click "Save Changes" button
- Wait for redeploy to complete

### Data still disappearing after restart?

**This means**: Still using SQLite

**Solution**:
1. Check backend logs for "PostgreSQL" message
2. Verify `DATABASE_URL` is set
3. Verify `NODE_ENV=production`
4. Redeploy backend manually

---

## ✅ Success Checklist

After updating, verify:
- [ ] Backend logs show "PostgreSQL database connection"
- [ ] No errors in logs
- [ ] Can create data (tourist/device)
- [ ] Data persists after backend restart
- [ ] Frontend can connect to backend
- [ ] No CORS errors

---

## 🎉 Done!

Your existing deployment now uses PostgreSQL!
- ✅ Data persists forever
- ✅ No more data loss on restart
- ✅ Production-ready database

---

## 💡 Pro Tip

After confirming PostgreSQL is working, you can:
1. Delete the old SQLite data (it's not used anymore)
2. Set up database backups (paid plans)
3. Monitor database usage in Render dashboard

---

Need help? Check the logs and look for error messages!
