# 📱 Mobile Access Guide

## 🌐 Access URLs

### Primary (WiFi Network)
**http://172.20.139.159:3000**

### Alternative Networks
- http://192.168.56.1:3000
- http://192.168.137.1:3000

---

## 📋 Setup Instructions

### Step 1: Ensure Servers are Running
```bash
cd smarttourist/Smart-Tourist-main
npm run dev
```

Both servers should be running:
- ✅ Frontend: Port 3000
- ✅ Backend: Port 5000

### Step 2: Connect Mobile to Same WiFi
- Make sure your mobile device is on the **same WiFi network** as your computer
- WiFi network: (Your current WiFi)

### Step 3: Open on Mobile
1. Open browser on your mobile (Chrome, Safari, etc.)
2. Type: **http://172.20.139.159:3000**
3. Press Enter

### Step 4: Allow Location Access
When prompted:
- ✅ Allow location access
- ✅ This enables GPS tracking and nearby places

---

## 🔐 Login Credentials

### Tourist Account
- **Email:** tourist@test.com
- **Password:** password123

### Admin Account
- **Email:** admin@test.com
- **Password:** admin123

### Police Account
- **Email:** police@test.com
- **Password:** police123

---

## ✨ Features on Mobile

### Tourist App
- 📍 Real-time GPS tracking
- 🚨 Emergency SOS button (hold 3 seconds)
- 🌤️ Weather with safety warnings
- 📞 Quick emergency contacts
- 🗺️ Nearby places (police, hospitals, hotels)
- 🌍 Multi-language support (10 languages)

### Map Tracking
- 🗺️ Interactive map
- 📍 Your location marker
- 🏥 Nearby hospitals
- 👮 Police stations
- 🏨 Hotels & restaurants
- 🎭 Tourist attractions

### Dashboard
- 📊 Safety score
- 📈 Statistics
- 🌤️ Weather widget
- 🔔 Notifications

---

## 🐛 Troubleshooting

### Can't Access from Mobile

**Problem:** Page doesn't load
**Solution:**
1. Check both devices are on same WiFi
2. Check firewall isn't blocking port 3000
3. Try alternative IP addresses above

**Problem:** "Connection refused"
**Solution:**
1. Verify servers are running on computer
2. Check `npm run dev` is active
3. Restart servers if needed

**Problem:** Location not working
**Solution:**
1. Allow location permission in browser
2. Use HTTPS or localhost (some browsers require this)
3. Check GPS is enabled on phone

### Firewall Issues (Windows)

If mobile can't connect, allow port 3000:
```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

---

## 📱 Best Practices

### For Testing
1. **Use WiFi** - More stable than mobile data
2. **Keep screen on** - Prevents GPS from sleeping
3. **Allow all permissions** - Location, notifications
4. **Use Chrome/Safari** - Best compatibility

### For Demo
1. **Login as Tourist** - Best mobile experience
2. **Enable location** - Shows real nearby places
3. **Test SOS button** - Hold for 3 seconds
4. **Check weather** - Shows real-time data

---

## 🔒 Security Notes

### Development Mode
- ⚠️ This is for development/testing only
- ⚠️ Not secure for production use
- ⚠️ Anyone on same WiFi can access

### For Production
- ✅ Use HTTPS
- ✅ Add authentication
- ✅ Use proper domain
- ✅ Enable CORS restrictions

---

## 🎯 Quick Test Checklist

- [ ] Servers running on computer
- [ ] Mobile on same WiFi
- [ ] Can access http://172.20.139.159:3000
- [ ] Login works
- [ ] Location permission granted
- [ ] GPS tracking active
- [ ] Weather displays
- [ ] Nearby places show
- [ ] SOS button works

---

## 📞 Emergency Features

### SOS Button
1. Go to Tourist App
2. Find red "PANIC BUTTON"
3. **Hold for 3 seconds**
4. Alert sent to backend
5. Location shared automatically

### Emergency Contacts
- Tourist Police: 1363
- Emergency Services: 112
- Local Police: 100

---

## 🌐 Network Information

**Your Computer IPs:**
- WiFi: 172.20.139.159 ✅ (Use this)
- Ethernet 4: 192.168.56.1
- Local Area: 192.168.137.1

**Ports:**
- Frontend: 3000
- Backend: 5000

---

## 🚀 Quick Start

1. **On Computer:**
   ```bash
   cd smarttourist/Smart-Tourist-main
   npm run dev
   ```

2. **On Mobile:**
   - Open browser
   - Go to: http://172.20.139.159:3000
   - Login: tourist@test.com / password123
   - Allow location
   - Enjoy!

---

**Last Updated:** Just now
**Status:** ✅ Ready for mobile access
**Primary URL:** http://172.20.139.159:3000
