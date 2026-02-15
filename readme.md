# 🛡️ Smart Tourist Safety Platform

A comprehensive real-time tourist safety monitoring and management system with AI-powered assistance, GPS tracking, emergency response, and IoT integration.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🌟 Features

### 🔐 Authentication & Security
- JWT-based authentication with auto-refresh
- Role-based access control (Admin, Tourist, Police, ID Issuer)
- Secure password hashing with bcrypt
- Session management with automatic token refresh

### 🗺️ Real-Time Map Tracking
- Interactive Leaflet.js maps with OpenStreetMap
- Live GPS location tracking
- Dynamic nearby places (5-20km radius)
- Heatmap visualization for crowd density
- Geofencing with safety zones (500m, 1km, restricted areas)
- Real-time updates every 30 seconds
- Filter by location type (tourists, police, hospitals, alerts)

### 📱 Tourist Mobile App
- Real-time GPS tracking with background sync
- Emergency SOS button (hold for 3 seconds)
- Safety score display
- Multi-language support (10 Indian languages)
- Emergency contacts with quick dial
- Nearby alerts and safety warnings
- Health status monitoring
- Weather integration with travel safety

### 🤖 AI Chatbot Assistant
- Google Gemini AI integration
- Context-aware responses
- Emergency scenario handling
- Quick action buttons
- Fallback mode for offline operation
- Multi-language support

### 🌤️ Weather Integration
- Real-time weather data (OpenWeather API)
- Temperature, humidity, wind speed, visibility
- Travel safety checks and warnings
- Weather-based recommendations
- 7-day forecast
- Severe weather alerts
- Auto-refresh every 10 minutes

### 👮 Police Dashboard
- Real-time alert monitoring
- Tourist location tracking
- Emergency response coordination
- Alert management (view, respond, resolve)
- Statistics and metrics
- IoT device monitoring

### 👤 Admin Dashboard
- System overview with statistics
- User management
- IoT device monitoring
- Tourist tracking
- Alert management
- Performance metrics
- Activity feed
- Weather widget

### 🌐 IoT Device Monitoring
- Real-time device status
- Device health monitoring
- Location tracking
- Battery level indicators
- Signal strength display
- Status filters

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/smart-tourist-safety.git
cd smart-tourist-safety
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

3. **Configure environment variables**
```bash
# Copy example env file
cp backend/.env.template backend/.env

# Edit backend/.env and add your API keys:
# - GEMINI_API_KEY (for AI chatbot)
# - OPENWEATHER_API_KEY (for weather)
# - GOOGLE_MAPS_API_KEY (for directions)
```

4. **Start the application**
```bash
npm run dev
```

This starts both frontend (port 3000) and backend (port 5000).

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🔑 Default Login Credentials

### Tourist Account
- **Email:** tourist@test.com
- **Password:** password123

### Admin Account
- **Email:** admin@test.com
- **Password:** admin123

### Police Account
- **Email:** police@test.com
- **Password:** police123

### ID Issuer Account
- **Email:** idissuer@test.com
- **Password:** issuer123

---

## 📱 Mobile Access

### Setup
1. Ensure servers are running
2. Connect mobile to same WiFi as computer
3. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```
4. Access from mobile: `http://YOUR_IP:3000`

### Features on Mobile
- Real-time GPS tracking
- Emergency SOS button
- Weather with safety warnings
- Nearby places
- Emergency contacts
- Multi-language support

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, Shadcn/ui
- **Maps:** Leaflet.js
- **Animations:** Framer Motion
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Routing:** React Router v6

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (dev), PostgreSQL (production)
- **ORM:** Sequelize
- **Authentication:** JWT (jsonwebtoken)
- **Real-time:** Socket.io
- **Security:** bcrypt, helmet, cors
- **Validation:** express-validator

### External APIs
- **Maps:** OpenStreetMap, Overpass API
- **AI:** Google Gemini API
- **Weather:** OpenWeather API
- **SMS:** Twilio (optional)
- **Push Notifications:** Firebase (optional)

---

## 📁 Project Structure

```
smart-tourist-safety/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── middleware/
│   │   ├── auth-improved.js     # JWT authentication
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Tourist.js           # Tourist profile
│   │   ├── Device.js            # IoT device
│   │   └── Alert.js             # Alert model
│   ├── routes/
│   │   ├── auth-improved.js     # Auth endpoints
│   │   ├── tourists.js          # Tourist endpoints
│   │   ├── devices.js           # Device endpoints
│   │   ├── alerts.js            # Alert endpoints
│   │   ├── weather.js           # Weather endpoints
│   │   └── chatbot.js           # Chatbot endpoints
│   ├── services/
│   │   ├── chatbotService.js    # Gemini AI integration
│   │   ├── weatherService.js    # Weather service
│   │   └── notificationService.js
│   ├── .env                     # Environment variables
│   ├── database.sqlite          # SQLite database
│   └── server.js                # Express server
├── src/
│   ├── components/
│   │   ├── AIChatbot.tsx        # AI chatbot
│   │   ├── MapView.tsx          # Map component
│   │   ├── WeatherWidget.tsx    # Weather widget
│   │   └── ui/                  # UI components
│   ├── contexts/
│   │   ├── AuthContextImproved.tsx
│   │   └── WebSocketContext.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── TouristApp.tsx       # Tourist app
│   │   ├── MapTracking.tsx      # Map tracking
│   │   ├── PoliceDashboard.tsx  # Police dashboard
│   │   └── AdminDashboard.tsx   # Admin dashboard
│   ├── utils/
│   │   └── apiClient.ts         # API client
│   └── App.tsx                  # Main app
├── public/
├── package.json
└── README.md
```

---

## 🔧 Configuration

### Environment Variables

Create `backend/.env` with:

```env
# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=7d

# AI Chatbot
GEMINI_API_KEY=your_gemini_api_key

# Weather
OPENWEATHER_API_KEY=your_openweather_key

# Google Maps (optional)
GOOGLE_MAPS_API_KEY=your_google_maps_key

# Push Notifications (optional)
FIREBASE_SERVER_KEY=your_firebase_key

# SMS Alerts (optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

### Get API Keys

1. **Google Gemini AI:** https://makersuite.google.com/app/apikey
2. **OpenWeather:** https://openweathermap.org/api (FREE tier available)
3. **Google Maps:** https://console.cloud.google.com/
4. **Firebase:** https://console.firebase.google.com/
5. **Twilio:** https://www.twilio.com/console

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/verify` - Verify token

### Weather
- `GET /api/weather/current?lat={lat}&lon={lon}` - Current weather
- `GET /api/weather/forecast?lat={lat}&lon={lon}&days={days}` - Forecast
- `GET /api/weather/alerts?lat={lat}&lon={lon}` - Weather alerts
- `GET /api/weather/safety?lat={lat}&lon={lon}` - Travel safety check

### Tourists
- `GET /api/tourists` - Get all tourists
- `GET /api/tourists/me` - Get current tourist
- `POST /api/tourists/me/location` - Update location
- `POST /api/tourists/me/emergency` - Send SOS alert

### Devices
- `GET /api/devices` - Get all IoT devices
- `GET /api/devices/:id` - Get device by ID
- `POST /api/devices` - Create device
- `PUT /api/devices/:id` - Update device

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

### Chatbot
- `POST /api/chatbot/message` - Send message to AI

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test API Endpoints
```bash
# Test weather
curl "http://localhost:5000/api/weather/current?lat=28.6139&lon=77.209"

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tourist@test.com","password":"password123"}'
```

---

## 📈 Features Roadmap

### Completed ✅
- [x] Authentication system
- [x] Real-time map tracking
- [x] AI chatbot
- [x] Weather integration
- [x] Tourist mobile app
- [x] Police dashboard
- [x] Admin dashboard
- [x] IoT monitoring
- [x] Emergency SOS
- [x] Multi-language support

### In Progress 🚧
- [ ] Offline mode
- [ ] Push notifications
- [ ] Photo sharing
- [ ] Emergency contact auto-notify
- [ ] Patrol routes
- [ ] Health monitoring

### Planned 📋
- [ ] Native mobile apps (iOS/Android)
- [ ] AR navigation
- [ ] Blockchain identity
- [ ] ML-based risk prediction
- [ ] Smart wearables integration
- [ ] Video calls with police

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work*

---

## 🙏 Acknowledgments

- OpenStreetMap for map data
- OpenWeather for weather API
- Google for Gemini AI
- Leaflet.js for mapping library
- Shadcn/ui for UI components

---

## 📞 Support

For support, email support@example.com or open an issue on GitHub.

---

## 🔒 Security

### Reporting Security Issues
Please report security vulnerabilities to security@example.com

### Security Features
- JWT authentication with auto-refresh
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

---

## 📚 Documentation

- [Complete Setup Guide](COMPLETE_SETUP_README.md)
- [Features Guide](FEATURES_GUIDE.md)
- [Weather Setup](WEATHER_SETUP.md)
- [Mobile Access](MOBILE_ACCESS.md)
- [API Documentation](API_DOCS.md)

---

## 🎯 Use Cases

### For Tourists
- Real-time safety monitoring
- Emergency assistance
- Weather-based travel planning
- Nearby facilities discovery
- Multi-language support

### For Police
- Tourist location tracking
- Emergency response
- Alert management
- IoT device monitoring
- Patrol route planning

### For Administrators
- System monitoring
- User management
- Analytics and reporting
- Device management
- Alert coordination

---

**Made with ❤️ for tourist safety**
