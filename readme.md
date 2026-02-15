# 🛡️ Smart Tourist Safety Platform

A comprehensive real-time tourist safety monitoring and management system with AI-powered assistance, GPS tracking, emergency response, and IoT integration.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 👥 Contributors

- **SAICHARAN1189** - Lead Developer - [@SAICHARAN1189](https://github.com/SAICHARAN1189)
- **DurPunam** - Project Owner - [@DurPunam](https://github.com/DurPunam)

See [CONTRIBUTORS.md](CONTRIBUTORS.md) for detailed contributions.

---

## 🚀 Quick Start

```bash
git clone https://github.com/DurPunam/smarttourist.git
cd smarttourist
npm install
cd backend && npm install && cd ..
cp backend/.env.template backend/.env
# Add your API keys to backend/.env
npm run dev
```

**Access:** http://localhost:3000

---

## 📱 Mobile Access

Connect your mobile to same WiFi and access: **http://YOUR_IP:3000**

---

## 🔑 Login Credentials

- **Tourist:** tourist@test.com / password123
- **Admin:** admin@test.com / admin123
- **Police:** police@test.com / police123

---

## 🌟 Features

### Core Features
- ✅ **Authentication** - JWT-based with auto-refresh
- ✅ **Real-time GPS Tracking** - Live location monitoring
- ✅ **AI Chatbot** - Google Gemini integration
- ✅ **Weather Integration** - OpenWeather API with safety alerts
- ✅ **Emergency SOS** - Hold-to-activate panic button
- ✅ **Police Dashboard** - Alert monitoring and response
- ✅ **Admin Dashboard** - System management
- ✅ **IoT Monitoring** - Device health and status
- ✅ **Multi-language** - 10 Indian languages supported

### Map Features
- Interactive Leaflet.js maps
- Dynamic nearby places (5-20km radius)
- Heatmap visualization
- Geofencing (500m, 1km zones)
- Real-time updates every 30 seconds
- Filter by type (tourists, police, hospitals)

### Tourist App
- Real-time GPS tracking
- Emergency SOS button (hold 3 seconds)
- Safety score display
- Emergency contacts with quick dial
- Nearby alerts and warnings
- Health status monitoring
- Weather with travel safety

---

## 🛠️ Tech Stack

**Frontend:**
- React 18, TypeScript, Vite
- Tailwind CSS, Radix UI, Shadcn/ui
- Leaflet.js, Framer Motion
- React Router v6, Axios

**Backend:**
- Node.js, Express.js
- SQLite (dev), Sequelize ORM
- JWT, bcrypt, Socket.io
- helmet, cors, express-validator

**External APIs:**
- Google Gemini AI
- OpenWeather API
- OpenStreetMap Overpass API
- Google Maps API

---

## 📚 Documentation

- [Complete Setup Guide](COMPLETE_SETUP_README.md)
- [Features Guide](FEATURES_GUIDE.md)
- [Weather Setup](WEATHER_SETUP.md)
- [Mobile Access Guide](MOBILE_ACCESS.md)
- [Contributors](CONTRIBUTORS.md)

---

## 🔧 Configuration

Create `backend/.env` with:

```env
# AI Chatbot
GEMINI_API_KEY=your_gemini_api_key

# Weather
OPENWEATHER_API_KEY=your_openweather_key

# Google Maps (optional)
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

**Get API Keys:**
- Google Gemini: https://makersuite.google.com/app/apikey
- OpenWeather: https://openweathermap.org/api (FREE)
- Google Maps: https://console.cloud.google.com/

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Weather
- `GET /api/weather/current?lat={lat}&lon={lon}` - Current weather
- `GET /api/weather/forecast?lat={lat}&lon={lon}` - Forecast
- `GET /api/weather/safety?lat={lat}&lon={lon}` - Safety check

### Tourists
- `GET /api/tourists` - Get all tourists
- `POST /api/tourists/me/location` - Update location
- `POST /api/tourists/me/emergency` - Send SOS

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

MIT License - see LICENSE file for details

---

## 📞 Support

- Open an issue on GitHub
- Contact: [@SAICHARAN1189](https://github.com/SAICHARAN1189)

---

## 🙏 Acknowledgments

- OpenStreetMap for map data
- OpenWeather for weather API
- Google for Gemini AI
- Leaflet.js for mapping
- Shadcn/ui for UI components

---

**Made with ❤️ by SAICHARAN1189**

**Repository:** https://github.com/DurPunam/smarttourist
