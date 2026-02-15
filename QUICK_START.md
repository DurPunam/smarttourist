# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start Backend
```bash
cd smarttourist/Smart-Tourist-main/backend
npm start
```
Backend runs on: `http://localhost:5000`

### Step 2: Start Frontend
```bash
cd smarttourist/Smart-Tourist-main
npm run dev
```
Frontend runs on: `http://localhost:3000`

### Step 3: Login
Use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| Tourist | tourist@test.com | password123 |
| Police | police@test.com | police123 |

---

## 📱 Mobile Access

### On Same WiFi Network:
1. Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Open on mobile: `http://YOUR_IP:3000`
3. Example: `http://10.90.37.71:3000`

### Enable Firewall (Windows):
Run as Administrator:
```bash
netsh advfirewall firewall add rule name="Smart Tourist Frontend" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="Smart Tourist Backend" dir=in action=allow protocol=TCP localport=5000
```

Or run: `fix-firewall.bat`

---

## ✅ What's Working

### Fully Functional:
- ✅ Login/Register
- ✅ Tourist App (GPS, SOS, Settings)
- ✅ IoT Monitor (Real device data)
- ✅ Police Dashboard (Real alerts)
- ✅ Admin Dashboard (Real statistics)
- ✅ Emergency SOS
- ✅ Language selection
- ✅ Map tracking

### Needs Work:
- ⚠️ AI Chatbot (needs Gemini API key)
- ⚠️ Digital ID (needs blockchain)
- ⚠️ ID Verification (needs OCR)

---

## 🔧 Common Issues

### Issue: "Failed to fetch"
**Solution:** Backend not running. Start backend first.

### Issue: "Login failed"
**Solution:** Use correct credentials (see table above)

### Issue: "No data showing"
**Solution:** Run `backend/createSampleUsers-sqlite.js` to create sample data

### Issue: Mobile can't connect
**Solution:** 
1. Check firewall rules
2. Verify same WiFi network
3. Use correct IP address

---

## 📊 Features Overview

### Dashboard
- Real-time statistics
- IoT device monitoring
- Tourist management
- Alert notifications

### Tourist App
- GPS location tracking
- Emergency SOS button
- Language selection
- Emergency contacts
- Settings management

### Police Dashboard
- Active alerts
- Tourist monitoring
- Alert management
- Patrol routes

### Admin Dashboard
- System statistics
- Tourist management
- Device monitoring
- Alert analytics

---

## 🎯 Quick Actions

### Create Sample Data:
```bash
cd backend
node createSampleUsers-sqlite.js
```

### Reset Database:
```bash
cd backend
rm database.sqlite
node createSampleUsers-sqlite.js
```

### Check Backend Status:
```bash
curl http://localhost:5000/api/health
```

### View Logs:
Backend logs show in terminal where you ran `npm start`

---

## 📚 Documentation

- `COMPLETE_SETUP_README.md` - Full setup guide
- `INTEGRATION_COMPLETE.md` - Backend integration details
- `CODE_AUDIT_REPORT.md` - Feature status
- `WORK_COMPLETED_SUMMARY.md` - Recent changes
- `MOBILE_ACCESS_GUIDE.md` - Mobile setup
- `AI_CHATBOT_SETUP.md` - Chatbot configuration

---

## 🆘 Need Help?

### Check These First:
1. Is backend running? (port 5000)
2. Is frontend running? (port 3000)
3. Are you logged in?
4. Is database created?

### Still Stuck?
1. Check browser console (F12)
2. Check backend terminal logs
3. Try logging out and back in
4. Clear browser cache

---

## 🎉 You're Ready!

The platform is fully functional. Explore the features and enjoy!

**Happy coding! 🚀**
