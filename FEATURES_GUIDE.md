# Smart Tourist Safety Platform - Features Guide

## 🗺️ Map Tracking Feature

### Overview
Real-time map tracking system using **Leaflet.js** and **OpenStreetMap** for monitoring tourist locations, emergency alerts, and safety zones.

### Access the Map
1. Login to the application
2. Click **"Map Tracking"** in the navigation menu
3. The map will load with your current location

### Features

#### 📍 Real-Time Location Tracking
- View your current location with a pulsing blue marker
- Track multiple tourists simultaneously
- See location history and movement patterns

#### 🚨 Emergency Alerts
- Red pulsing markers indicate active emergencies
- Click on alert markers for details
- Quick response actions available

#### 🏥 Points of Interest
- **Blue markers** - Police stations
- **Red markers** - Hospitals
- **Green markers** - Safe zones
- **Orange markers** - Active alerts
- **Purple markers** - Tourist locations

#### 🔥 Heatmap View
- Toggle heatmap to see tourist density
- Identify crowded areas
- Plan safer routes

#### 🛡️ Geofencing
- View restricted areas marked in red
- Get alerts when entering/leaving zones
- Safety perimeter monitoring

#### 🎯 Interactive Features
- Click markers for detailed information
- Get directions to any location
- Filter by location type (tourists, police, hospitals, alerts)
- Real-time updates every 5 seconds

### Map Controls

**Top Right:**
- 🧭 Center on My Location
- 📊 Legend (marker types)

**Top Bar:**
- Show/Hide Heatmap
- Show/Hide Geofencing
- Refresh Data
- Filter by Type

**Right Sidebar:**
- Selected location details
- Quick actions (directions, respond to alerts)
- Location coordinates

### Sample Locations (Demo Data)
- Connaught Place - Tourist area
- Red Fort - Historical site
- India Gate - Safe zone
- AIIMS Hospital - Medical facility
- CP Police Station - Law enforcement

---

## 🤖 AI Chatbot Feature

### Overview
Intelligent AI assistant powered by **Google Gemini** for tourist safety, emergency guidance, and local information.

### Access the Chatbot
1. Look for the floating chat button (💬) in the bottom-right corner
2. Click to open the chat window
3. Start typing or use quick actions

### Features

#### 💬 Conversational AI
- Natural language understanding
- Context-aware responses
- Conversation history maintained
- Multi-turn conversations

#### 🚨 Quick Actions
Three one-click buttons for common needs:

1. **Emergency SOS** 🚨
   - Immediate emergency response
   - Alerts authorities
   - Shares your location
   - Provides emergency numbers

2. **Nearest Police** 📞
   - Finds nearby police stations
   - Shows distances
   - Provides contact numbers
   - Offers directions

3. **Safe Places** 📍
   - Lists safe public areas
   - 24/7 safe zones
   - Tourist-friendly locations
   - Emergency shelters

#### 🌐 Capabilities

**Safety Information:**
- Emergency procedures
- Safety tips for tourists
- Local customs and etiquette
- Health and medical advice

**Location Services:**
- Find nearby facilities
- Get directions
- Area safety ratings
- Weather alerts

**Emergency Assistance:**
- Step-by-step emergency guidance
- Contact emergency services
- Alert family/contacts
- Real-time location sharing

**Tourist Information:**
- Attraction recommendations
- Cultural information
- Travel tips
- Local regulations

### Sample Conversations

**Emergency:**
```
You: I need help! Someone is following me
Bot: I understand this is an emergency. Here's what to do:
     1. Call 112 immediately
     2. Move to a crowded, well-lit area
     3. I'm alerting nearby police
     4. Your location is being shared
```

**Finding Help:**
```
You: Where is the nearest hospital?
Bot: Based on your location, here are the nearest hospitals:
     1. AIIMS Hospital - 2.3 km away
     2. Safdarjung Hospital - 3.1 km away
     Would you like directions?
```

**Safety Tips:**
```
You: What safety precautions should I take?
Bot: Here are essential safety tips for tourists in India:
     1. Keep valuables secure
     2. Use registered transportation
     3. Stay in well-lit areas
     4. Keep emergency contacts handy
     ...
```

### Voice Input (Coming Soon)
- Click the microphone button
- Speak your question
- AI will respond with text and voice

### Chatbot Settings
- Clear conversation history
- Change language preference
- Enable/disable notifications
- Adjust response speed

---

## 🎨 Modern UI/UX Features

### Theme System
- **Light Mode** - Clean, professional interface
- **Dark Mode** - Eye-friendly for night use
- **Auto Mode** - Follows system preferences
- Toggle in top-right corner

### Glass Morphism Design
- Translucent cards with blur effects
- Smooth animations and transitions
- Modern gradient backgrounds
- Responsive layouts

### Color Palette
- **Primary (Deep Blue)** - Trust and safety
- **Secondary (Emerald Green)** - Success and alerts
- **Accent (Amber)** - Warnings and attention
- **Background** - Subtle gradients

### Animations
- Smooth page transitions
- Hover effects on cards
- Loading states
- Real-time updates

---

## 🔐 Enhanced Authentication

### Features
- **JWT Tokens** - Secure authentication
- **Token Refresh** - Automatic session renewal
- **Role-Based Access** - Different permissions per role
- **Account Approval** - Admin verification for police/ID issuers

### Token System
- **Access Token** - 15 minutes validity
- **Refresh Token** - 7 days validity
- Automatic refresh on expiry
- Secure HTTP-only cookies

### User Roles
1. **Tourist** - Full access to safety features
2. **Admin** - Platform management
3. **Police** - Emergency response
4. **ID Issuer** - Verification services

---

## 📱 Responsive Design

### Mobile Optimized
- Touch-friendly interface
- Swipe gestures
- Mobile navigation menu
- Optimized map controls

### Tablet Support
- Adaptive layouts
- Split-screen views
- Enhanced touch targets

### Desktop Experience
- Full-featured interface
- Multi-column layouts
- Keyboard shortcuts
- Advanced filters

---

## 🔔 Real-Time Features

### WebSocket Integration
- Live location updates
- Instant emergency alerts
- Real-time chat
- System notifications

### Push Notifications
- Emergency alerts
- Safety warnings
- System updates
- Chat messages

---

## 📊 Dashboard Features

### Overview Tab
- System statistics
- Active tourists count
- IoT device status
- Safety score

### IoT Monitor Tab
- Device health monitoring
- Battery levels
- Signal strength
- Maintenance alerts

### Tourists Tab
- Tourist management
- Location tracking
- Safety status
- Profile management

### Notifications Tab
- Alert history
- System messages
- Emergency logs
- Activity feed

---

## 🛠️ Technical Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Leaflet.js** - Maps
- **Shadcn/ui** - Components

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Socket.io** - Real-time
- **SQLite** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### AI & APIs
- **Google Gemini** - AI chatbot
- **OpenStreetMap** - Map tiles
- **Leaflet** - Map library

---

## 🚀 Getting Started

### Quick Start
1. Login with test credentials
2. Explore the dashboard
3. Try the map tracking
4. Chat with the AI assistant
5. Test emergency features

### Test Accounts
```
Admin:     admin@test.com / admin123
Tourist:   tourist@test.com / password123
Police:    police@test.com / police123
```

### Navigation
- **Dashboard** - Overview and statistics
- **Map Tracking** - Real-time location monitoring
- **Digital ID** - Tourist identification
- **IoT Monitor** - Device management
- **Admin Panel** - System administration

---

## 📖 Additional Resources

- [AI Chatbot Setup Guide](./AI_CHATBOT_SETUP.md)
- [Complete Setup README](./COMPLETE_SETUP_README.md)
- [Quick Start Guide](./QUICK_START.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

## 🆘 Support

### Emergency Numbers (India)
- **112** - Emergency Services
- **100** - Police
- **108** - Ambulance
- **1363** - Tourist Helpline

### Technical Support
- Check documentation
- Review error logs
- Contact admin team
- Submit bug reports

---

**Last Updated:** February 2026
**Version:** 2.0.0
