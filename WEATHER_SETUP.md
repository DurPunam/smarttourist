# Weather Integration Setup Guide

## ✅ What's Been Implemented

### Backend
- ✅ Weather service with OpenWeather API integration
- ✅ Weather routes (`/api/weather/*`)
- ✅ Current weather endpoint
- ✅ Weather forecast endpoint
- ✅ Weather alerts endpoint
- ✅ Travel safety check endpoint
- ✅ Caching (10 minutes)
- ✅ Fallback mock data when API key is missing

### Frontend
- ✅ WeatherWidget component
- ✅ Integrated in Dashboard
- ✅ Integrated in Tourist App
- ✅ Real-time weather display
- ✅ Travel safety warnings
- ✅ Weather-based recommendations
- ✅ Auto-refresh every 10 minutes

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get OpenWeather API Key

1. Go to https://openweathermap.org/api
2. Click "Sign Up" (it's FREE!)
3. Verify your email
4. Go to https://home.openweathermap.org/api_keys
5. Copy your API key

### Step 2: Add API Key to Backend

1. Open `smarttourist/Smart-Tourist-main/backend/.env`
2. Find the line: `OPENWEATHER_API_KEY=your_openweather_api_key`
3. Replace with your actual key:
   ```env
   OPENWEATHER_API_KEY=abc123your_actual_key_here
   ```
4. Save the file

### Step 3: Restart Backend Server

```bash
cd smarttourist/Smart-Tourist-main/backend
npm start
```

### Step 4: Test It!

1. Open http://localhost:3000
2. Login with any account
3. Go to Dashboard - You'll see weather widget
4. Go to Tourist App - You'll see weather with safety info

---

## 📊 Features

### Current Weather Display
- Temperature (°C)
- Feels like temperature
- Weather description
- Humidity percentage
- Wind speed
- Visibility
- Atmospheric pressure
- Location name

### Travel Safety Check
- Safe/Caution indicator
- Weather warnings
- Safety recommendations
- Automatic checks for:
  - Extreme temperatures
  - High winds
  - Low visibility
  - Severe weather alerts

### Weather Alerts
- Real-time severe weather alerts
- Alert severity levels (critical, high, medium, low)
- Alert descriptions
- Start and end times

### 7-Day Forecast
- Temperature predictions
- Weather conditions
- Precipitation probability
- Wind speed forecast

---

## 🔌 API Endpoints

### 1. Get Current Weather
```bash
GET /api/weather/current?lat=28.6139&lon=77.209
```

**Response:**
```json
{
  "success": true,
  "data": {
    "temperature": 25,
    "feelsLike": 27,
    "humidity": 60,
    "pressure": 1013,
    "description": "Clear sky",
    "icon": "01d",
    "windSpeed": 5,
    "visibility": 10000,
    "location": "New Delhi",
    "country": "IN",
    "timestamp": "2026-02-09T10:30:00.000Z"
  }
}
```

### 2. Get Weather Forecast
```bash
GET /api/weather/forecast?lat=28.6139&lon=77.209&days=5
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2026-02-09T12:00:00.000Z",
      "temperature": 26,
      "description": "Partly cloudy",
      "icon": "02d",
      "humidity": 55,
      "windSpeed": 4,
      "precipitation": 10
    }
    // ... more forecast data
  ]
}
```

### 3. Get Weather Alerts
```bash
GET /api/weather/alerts?lat=28.6139&lon=77.209
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "event": "Heat Wave",
      "start": "2026-02-09T06:00:00.000Z",
      "end": "2026-02-10T18:00:00.000Z",
      "description": "Extreme heat expected",
      "severity": "high",
      "tags": ["heat", "warning"]
    }
  ]
}
```

### 4. Check Travel Safety
```bash
GET /api/weather/safety?lat=28.6139&lon=77.209
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isSafe": true,
    "warnings": [],
    "recommendations": ["Stay hydrated", "Use sunscreen"]
  }
}
```

---

## 🎨 Using WeatherWidget Component

### Basic Usage
```tsx
import { WeatherWidget } from '@/components/WeatherWidget';

// Auto-detects user location
<WeatherWidget />
```

### With Specific Location
```tsx
<WeatherWidget 
  lat={28.6139} 
  lon={77.209} 
/>
```

### With Safety Information
```tsx
<WeatherWidget 
  lat={28.6139} 
  lon={77.209} 
  showSafety={true}
/>
```

### Compact Mode
```tsx
<WeatherWidget 
  compact={true}
/>
```

---

## 🔧 Configuration

### Cache Duration
Weather data is cached for 10 minutes to reduce API calls.

To change cache duration, edit `backend/services/weatherService.js`:
```javascript
this.cache = new NodeCache({ stdTTL: 600 }); // 600 seconds = 10 minutes
```

### Temperature Units
Currently set to Celsius. To change to Fahrenheit, edit `backend/services/weatherService.js`:
```javascript
params: {
  lat,
  lon,
  appid: this.apiKey,
  units: 'imperial', // Change from 'metric' to 'imperial'
}
```

### Safety Thresholds
Edit `backend/services/weatherService.js` in the `isSafeForTravel` method:
```javascript
// Temperature thresholds
if (weather.temperature > 40) { // Extreme heat
if (weather.temperature < 5) { // Cold weather

// Wind speed threshold
if (weather.windSpeed > 15) { // High wind

// Visibility threshold
if (weather.visibility < 1000) { // Low visibility
```

---

## 📱 Where Weather is Displayed

### 1. Dashboard
- Full weather widget with all details
- Located in the right sidebar
- Shows current conditions
- Auto-refreshes every 10 minutes

### 2. Tourist App
- Full weather widget with safety info
- Shows travel safety warnings
- Weather-based recommendations
- Uses tourist's current GPS location

### 3. Admin Dashboard
- Compact weather widget
- Quick weather overview
- System-wide weather monitoring

---

## 🆓 OpenWeather API - Free Tier

### What's Included (FREE)
- ✅ Current weather data
- ✅ 5-day / 3-hour forecast
- ✅ 60 calls/minute
- ✅ 1,000,000 calls/month
- ✅ No credit card required

### What's NOT Included (Paid)
- ❌ 16-day forecast
- ❌ Historical data
- ❌ Weather maps
- ❌ Air pollution data

**For this project, the FREE tier is more than enough!**

---

## 🧪 Testing

### Test Without API Key
The system works without an API key using mock data:
- Shows demo weather data
- Displays "Demo Data" badge
- All features work normally

### Test With API Key
1. Add API key to `.env`
2. Restart backend
3. Check weather widget
4. Should show real weather data
5. No "Demo Data" badge

### Test Different Locations
```bash
# Test Delhi
curl "http://localhost:5000/api/weather/current?lat=28.6139&lon=77.209"

# Test Mumbai
curl "http://localhost:5000/api/weather/current?lat=19.0760&lon=72.8777"

# Test Bangalore
curl "http://localhost:5000/api/weather/current?lat=12.9716&lon=77.5946"
```

---

## 🐛 Troubleshooting

### Issue: "Demo Data" Badge Shows
**Solution:** API key is missing or invalid
- Check `.env` file has correct key
- Verify key is active on OpenWeather
- Restart backend server

### Issue: Weather Not Loading
**Solution:** Check browser console
- Look for API errors
- Check network tab
- Verify backend is running

### Issue: Wrong Location
**Solution:** Location permission denied
- Allow location access in browser
- Check browser settings
- Try refreshing page

### Issue: API Rate Limit
**Solution:** Too many requests
- Free tier: 60 calls/minute
- Cache reduces API calls
- Wait a minute and try again

---

## 📈 Future Enhancements

### Planned Features
- [ ] Weather-based alert notifications
- [ ] Severe weather push notifications
- [ ] Weather history tracking
- [ ] Weather-based route recommendations
- [ ] Air quality index
- [ ] UV index warnings
- [ ] Sunrise/sunset times
- [ ] Moon phases

### Advanced Features
- [ ] Weather maps overlay
- [ ] Radar images
- [ ] Lightning detection
- [ ] Storm tracking
- [ ] Flood warnings
- [ ] Earthquake alerts

---

## 📚 Resources

- **OpenWeather API Docs:** https://openweathermap.org/api
- **Weather Icons:** https://openweathermap.org/weather-conditions
- **API Dashboard:** https://home.openweathermap.org/
- **Support:** https://openweathermap.org/faq

---

## ✅ Checklist

- [x] Weather service implemented
- [x] Weather routes created
- [x] WeatherWidget component created
- [x] Integrated in Dashboard
- [x] Integrated in Tourist App
- [x] Caching implemented
- [x] Fallback mock data
- [x] Safety checks
- [x] Auto-refresh
- [ ] Get OpenWeather API key (YOU DO THIS)
- [ ] Add key to .env (YOU DO THIS)
- [ ] Restart backend (YOU DO THIS)
- [ ] Test weather display (YOU DO THIS)

---

**Status:** ✅ Implementation Complete
**Next Step:** Get your FREE API key and add it to `.env`
**Time Required:** 5 minutes

**Get API Key:** https://openweathermap.org/api
