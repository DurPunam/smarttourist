# How to Create PostgreSQL Database on Render.com

## Step-by-Step Guide with Screenshots

### Step 1: Go to Render Dashboard
1. Open your browser and go to: **https://dashboard.render.com/**
2. Log in with your account (or sign up if you don't have one)

---

### Step 2: Click "New +" Button
1. Look at the top right corner of the dashboard
2. Click the blue **"New +"** button
3. A dropdown menu will appear

**What you'll see:**
```
New +
  ├── Web Service
  ├── Static Site
  ├── Private Service
  ├── Background Worker
  ├── Cron Job
  └── PostgreSQL  ← Click this one!
```

---

### Step 3: Click "PostgreSQL"
1. From the dropdown menu, click **"PostgreSQL"**
2. You'll be taken to the "Create PostgreSQL" page

---

### Step 4: Fill in Database Details

You'll see a form with these fields:

#### **Name** (Required)
- Enter: `smarttourist-db`
- This is just a label for you to identify the database

#### **Database** (Optional)
- Enter: `smarttourist`
- This is the actual database name inside PostgreSQL
- If you leave it empty, Render will auto-generate one

#### **User** (Optional)
- Enter: `smarttourist_user`
- This is the username for the database
- If you leave it empty, Render will auto-generate one

#### **Region** (Required)
- Choose the region closest to your users
- Options: `Oregon (US West)`, `Ohio (US East)`, `Frankfurt (EU)`, `Singapore (Asia)`
- **Tip:** Choose the same region where you'll deploy your backend

#### **PostgreSQL Version** (Optional)
- Leave as default (usually PostgreSQL 16)

#### **Instance Type** (Required)
- **Free**: 256 MB RAM, 1 GB Storage (Good for testing)
- **Starter**: $7/month, 1 GB RAM, 10 GB Storage (Good for production)
- **Standard**: $20/month and up (For larger apps)

**For now, choose: Free** ✅

---

### Step 5: Click "Create Database"
1. Scroll down to the bottom
2. Click the blue **"Create Database"** button
3. Wait 1-2 minutes while Render creates your database

**You'll see:**
```
Creating PostgreSQL database...
⏳ Setting up infrastructure
⏳ Initializing database
✅ Database ready!
```

---

### Step 6: Copy Database URL

Once created, you'll see the database info page with:

#### **Internal Database URL** (This is what you need!)
```
postgresql://smarttourist_user:password123@dpg-xxxxx-a.oregon-postgres.render.com/smarttourist
```

**How to copy it:**
1. Look for **"Internal Database URL"** section
2. Click the **"Copy"** icon next to it
3. Save it somewhere safe (you'll need it for backend deployment)

#### **External Database URL** (Don't use this for Render backend)
```
postgresql://smarttourist_user:password123@dpg-xxxxx-a.oregon-postgres.render.com:5432/smarttourist
```
- Only use this if connecting from your local computer

---

### Step 7: Verify Database is Running

Check the status at the top of the page:
- **Green dot** + "Available" = ✅ Database is ready!
- **Yellow dot** + "Creating" = ⏳ Wait a bit more
- **Red dot** + "Failed" = ❌ Something went wrong (contact Render support)

---

## What You Have Now

✅ **PostgreSQL database** running on Render
✅ **Database URL** copied and ready to use
✅ **Free tier** (or paid if you chose that)

---

## Next Steps

Now you need to:
1. **Deploy your backend** and add the `DATABASE_URL` environment variable
2. **Deploy your frontend**
3. **Test everything**

See `RENDER_DEPLOYMENT.md` for complete deployment instructions!

---

## Important Notes

### Database URL Format
```
postgresql://[user]:[password]@[host]/[database]
```

Example:
```
postgresql://smarttourist_user:abc123xyz@dpg-abc123-a.oregon-postgres.render.com/smarttourist
```

### Free Tier Limits
- **Storage**: 1 GB
- **RAM**: 256 MB
- **Connections**: 97 max
- **Expires**: After 90 days of inactivity (you'll get email warning)

### Security
- ✅ Database URL contains password - keep it secret!
- ✅ Only share it via environment variables
- ❌ Never commit it to GitHub
- ❌ Never share it publicly

---

## Troubleshooting

### Can't find "New +" button?
- Make sure you're logged in
- Try refreshing the page
- Check if you're on the dashboard (not a specific service page)

### Database creation failed?
- Check your email for verification (new accounts)
- Try a different region
- Contact Render support: support@render.com

### Forgot to copy Database URL?
- Go to Render Dashboard
- Click on your database name
- Scroll to "Connections" section
- Copy "Internal Database URL"

---

## Quick Reference

**Dashboard URL**: https://dashboard.render.com/
**Database Type**: PostgreSQL
**Recommended Name**: `smarttourist-db`
**Recommended Region**: Same as your backend
**Recommended Plan**: Free (for testing), Starter (for production)

---

That's it! Your PostgreSQL database is ready! 🎉

Next: Deploy your backend with this database URL.
