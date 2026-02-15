# 🏛️ Smart Tourist Safety Platform - Complete Setup Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Requirements](#system-requirements)
3. [Installation Guide](#installation-guide)
4. [Running the Application](#running-the-application)
5. [Login Credentials](#login-credentials)
6. [Features & Functionality](#features--functionality)
7. [Project Structure](#project-structure)
8. [API Documentation](#api-documentation)
9. [Troubleshooting](#troubleshooting)
10. [Development Guide](#development-guide)

---

## 🎯 Project Overview

The **Smart Tourist Safety Platform** is a comprehensive MERN stack application designed for monitoring and ensuring tourist safety in India. It provides real-time tracking, emergency alerts, IoT device monitoring, and government oversight capabilities.

### Key Features
- **Real-time Tourist Tracking**: GPS-based location monitoring
- **Emergency Alert System**: Instant SOS functionality with panic button
- **IoT Device Integration**: Smart bands, trackers, and health sensors
- **Admin Dashboard**: Comprehensive monitoring and analytics
- **Role-Based Access Control**: Tourist, Police, ID Issuer, and Admin roles
- **WebSocket Communication**: Live updates and notifications
- **Digital Tourist ID**: Secure identification system
- **Multi-language Support**: 10+ Indian languages

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + Socket.io
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Authentication**: JWT (JSON Web Tokens)
- **UI Components**: Shadcn/ui + Radix UI
- **State Management**: React Query (TanStack Query)

---

## 💻 System Requirements

### Required Software

| Software | Minimum Version | Download Link |
|----------|----------------|---------------|
| Node.js | v18.0.0 | https://nodejs.org/ |
| npm | v8.0.0 | Included with Node.js |
| Git | Latest | https://git-scm.com/ |
| Code Editor | Any | VS Code recommended |

### System Specifications
- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 500MB free space
- **Browser**: Chrome, Firefox, Edge, or Safari (latest versions)

---

## 🚀 Installation Guide

### Step 1: Verify Node.js Installation

Open Command Prompt or PowerShell and check versions:

```cmd
node --version
npm --version
```

Expected output:
```
v18.x.x or higher
8.x.x or higher
```

### Step 2: Navigate to Project Directory

```cmd
cd smarttourist\Smart-Tourist-main
```

### Step 3: Install Frontend Dependencies

```cmd
npm install
```

This will install all React, Vite, and UI component dependencies.

### Step 4: Install Backend Dependencies

```cmd
cd backend
npm install
cd ..
```

This installs Express, Socket.io, Sequelize, and other backend packages.

### Step 5: Verify Environment Configuration

The backend `.env` file is already configured at:
`smarttourist\Smart-Tourist-main\backend\.env`

Default settings:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=dev-refresh-secret
JWT_REFRESH_EXPIRE=30d
WS_CORS_ORIGIN=http://localhost:3000
BCRYPT_ROUNDS=12
```

### Step 6: Create Sample Users (Important!)

```cmd
cd backend
node createSampleUsers-sqlite.js
cd ..
```

This creates test users with different roles for testing the application.

---

## ▶️ Running the Application

### Option 1: Run Both Servers Together (Recommended)

```cmd
npm run dev
```

This starts:
- ✅ Backend API Server on **http://localhost:5000**
- ✅ Frontend Development Server on **http://localhost:3000**

### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```cmd
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```cmd
npm run client
```

### Verify Servers are Running

You should see output like:
```
[0] 🚀 Server running on port 5000
[0] ✅ SQLite database connection established successfully
[1] VITE v6.3.6 ready in 375 ms
[1] ➜ Local: http://localhost:3000/
```

### Access the Application

Open your browser and navigate to:
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 🔐 Login Credentials

### Active Users (Ready to Login)

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **👤 Tourist** | `tourist@test.com` | `password123` | Tourist Dashboard, Digital ID, Safety App |
| **⚖️ Admin** | `admin@test.com` | `admin123` | Full System Access, User Management |
| **👮 Police** | `police@test.com` | `police123` | Police Dashboard, IoT Monitor, Alerts |
| **🆔 ID Issuer** | `idissuer@test.com` | `issuer123` | ID Verification Center |

### Pending Approval Users (For Testing Approval Workflow)

| Role | Email | Password | Status |
|------|-------|----------|--------|
| **👮 Police** | `police.pending@test.com` | `police123` | ⏳ Needs Admin Approval |
| **🆔 ID Issuer** | `idissuer.pending@test.com` | `issuer123` | ⏳ Needs Admin Approval |

### Testing User Approval Workflow

1. Login as Admin (`admin@test.com` / `admin123`)
2. Navigate to **User Management** or **Approvals** section
3. Approve pending users
4. Logout and login with newly approved credentials

---

## 🎨 Features & Functionality

### 1. Tourist Features


#### Digital Tourist ID
- Blockchain-based secure identification
- QR code generation for quick verification
- Personal information and travel details
- Emergency contact information

#### Safety App
- Real-time location tracking
- Panic/SOS button for emergencies
- Health monitoring integration
- Travel history and itinerary

#### Emergency Alerts
- One-click emergency alert
- Automatic location sharing
- Direct connection to local authorities
- Family/friend notifications

### 2. Admin Features

#### Dashboard
- Real-time statistics and analytics
- Active tourist count and locations
- Alert monitoring and management
- System health metrics

#### User Management
- Approve/reject new user registrations
- Manage user roles and permissions
- View user activity logs
- Suspend or activate accounts

#### Analytics
- Tourist demographics and statistics
- Popular destinations tracking
- Emergency response times
- System usage metrics

### 3. Police Features

#### Police Dashboard
- Active alerts and emergencies
- Tourist location tracking
- Incident management
- Response coordination

#### IoT Monitor
- Real-time device status
- Health vitals monitoring
- Battery and connectivity status
- Device alerts and notifications

### 4. ID Issuer Features

#### Verification Center
- Tourist ID verification
- Document validation
- QR code scanning
- Registration processing

---

## 📁 Project Structure

```
smarttourist/Smart-Tourist-main/
│
├── backend/                          # Backend Node.js/Express Application
│   ├── config/
│   │   └── database.js              # SQLite/PostgreSQL configuration
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication middleware
│   │   └── errorHandler.js          # Global error handling
│   ├── models/
│   │   ├── User.js                  # User model (authentication)
│   │   ├── Tourist.js               # Tourist profile model
│   │   ├── Device.js                # IoT device model
│   │   └── Alert.js                 # Emergency alert model
│   ├── routes/
│   │   ├── auth.js                  # Authentication routes
│   │   ├── tourists.js              # Tourist management routes
│   │   ├── devices.js               # Device management routes
│   │   ├── alerts.js                # Alert management routes
│   │   └── admin.js                 # Admin routes
│   ├── scripts/
│   │   ├── createSampleUsers.js     # PostgreSQL sample users
│   │   └── createDefaultUser.js     # Create default admin
│   ├── .env                         # Environment variables
│   ├── server.js                    # Main server file
│   ├── database.sqlite              # SQLite database (auto-generated)
│   ├── createSampleUsers-sqlite.js  # SQLite sample users script
│   └── package.json                 # Backend dependencies
│
├── src/                             # Frontend React Application
│   ├── components/
│   │   ├── ui/                      # Shadcn/ui components (51 files)
│   │   ├── AdminLayout.tsx          # Admin dashboard layout
│   │   ├── Navigation.tsx           # Main navigation component
│   │   ├── ProtectedRoute.tsx       # Route protection
│   │   ├── TouristManagement.tsx    # Tourist management UI
│   │   ├── IoTMonitor.tsx           # IoT device monitoring
│   │   ├── ActivityFeed.tsx         # Activity feed component
│   │   ├── NotificationSystem.tsx   # Real-time notifications
│   │   └── ...                      # Other components
│   ├── pages/                       # Page components
│   ├── hooks/                       # Custom React hooks
│   ├── utils/                       # Utility functions
│   ├── App.tsx                      # Main app component
│   └── main.tsx                     # Entry point
│
├── public/                          # Static assets
│   └── robots.txt
│
├── node_modules/                    # Dependencies (auto-generated)
├── package.json                     # Frontend dependencies
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── index.html                       # HTML entry point
│
├── README.md                        # Original project README
├── COMPLETE_SETUP_README.md         # This file
├── WINDOWS_SETUP_GUIDE.md           # Quick Windows setup guide
├── SAMPLE_LOGIN_CREDENTIALS.md      # Login credentials reference
└── DEPLOYMENT.md                    # Production deployment guide
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "tourist"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "tourist@test.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "tourist@test.com",
    "role": "tourist",
    "status": "active"
  }
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Tourist Endpoints

#### Get All Tourists (Admin Only)
```http
GET /api/tourists
Authorization: Bearer <admin_token>
```

#### Get Current User Profile
```http
GET /api/tourists/me
Authorization: Bearer <token>
```

#### Update Tourist Profile
```http
PUT /api/tourists/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "+91-9876543210",
  "emergencyContact": "+91-9876543211",
  "nationality": "Indian"
}
```

#### Update Location
```http
POST /api/tourists/me/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "address": "New Delhi, India"
}
```

#### Trigger Emergency Alert
```http
POST /api/tourists/me/emergency
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "medical",
  "message": "Need immediate medical assistance",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  }
}
```

### Device Endpoints

#### Get All Devices
```http
GET /api/devices
Authorization: Bearer <token>
```

#### Create New Device
```http
POST /api/devices
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "deviceId": "DEVICE-001",
  "type": "smart_band",
  "touristId": 1
}
```

#### Update Device Vitals
```http
POST /api/devices/:id/vitals
Authorization: Bearer <token>
Content-Type: application/json

{
  "heartRate": 75,
  "temperature": 98.6,
  "bloodPressure": "120/80",
  "oxygenLevel": 98
}
```

### Alert Endpoints

#### Get All Alerts
```http
GET /api/alerts
Authorization: Bearer <token>
```

#### Get Specific Alert
```http
GET /api/alerts/:id
Authorization: Bearer <token>
```

#### Acknowledge Alert (Police/Admin)
```http
PUT /api/alerts/:id/acknowledge
Authorization: Bearer <police_token>
```

#### Resolve Alert
```http
PUT /api/alerts/:id/resolve
Authorization: Bearer <police_token>
Content-Type: application/json

{
  "resolution": "Medical assistance provided",
  "notes": "Tourist is safe and stable"
}
```

### Admin Endpoints

#### Get Dashboard Data
```http
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

Response:
```json
{
  "totalTourists": 150,
  "activeTourists": 120,
  "totalAlerts": 25,
  "activeAlerts": 3,
  "devices": {
    "total": 200,
    "online": 180,
    "offline": 20
  }
}
```

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

#### Approve User
```http
PUT /api/admin/users/:id/approve
Authorization: Bearer <admin_token>
```

#### Send Broadcast Message
```http
POST /api/admin/broadcast
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "message": "System maintenance scheduled",
  "type": "info",
  "recipients": "all"
}
```

---

## 🔄 WebSocket Events

### Client to Server Events

#### Authenticate Connection
```javascript
socket.emit('auth', { token: 'your-jwt-token' });
```

#### Send Device Update
```javascript
socket.emit('device_update', {
  deviceId: 'DEVICE-001',
  vitals: {
    heartRate: 75,
    temperature: 98.6
  }
});
```

#### Send Location Update
```javascript
socket.emit('location_update', {
  latitude: 28.6139,
  longitude: 77.2090,
  timestamp: Date.now()
});
```

#### Trigger Emergency
```javascript
socket.emit('emergency_alert', {
  type: 'medical',
  location: { lat: 28.6139, lng: 77.2090 }
});
```

### Server to Client Events

#### Receive Device Update
```javascript
socket.on('device_update', (data) => {
  console.log('Device updated:', data);
});
```

#### Receive Emergency Alert
```javascript
socket.on('emergency_alert', (alert) => {
  console.log('Emergency:', alert);
  // Show notification
});
```

#### Receive Location Update
```javascript
socket.on('location_update', (location) => {
  console.log('Location:', location);
  // Update map
});
```

#### Receive Broadcast
```javascript
socket.on('broadcast', (message) => {
  console.log('Broadcast:', message);
});
```

---

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. "npm not found" or "node not found"

**Problem**: Node.js is not installed or not in PATH

**Solution**:
- Download and install Node.js from https://nodejs.org/
- Restart your terminal/command prompt
- Verify installation: `node --version`

#### 2. Port Already in Use

**Problem**: Port 3000 or 5000 is already being used

**Solution for Port 5000**:
```cmd
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Or change the port** in `backend\.env`:
```env
PORT=5001
```

#### 3. Module Not Found Errors

**Problem**: Dependencies not installed properly

**Solution**:
```cmd
# Delete node_modules and reinstall
rmdir /s /q node_modules
rmdir /s /q backend\node_modules
npm install
cd backend
npm install
cd ..
```

#### 4. Database Connection Errors

**Problem**: SQLite database file issues

**Solution**:
```cmd
# Delete and recreate database
del backend\database.sqlite
cd backend
node createSampleUsers-sqlite.js
cd ..
```

#### 5. Vite Config Errors

**Problem**: Multiple export default statements

**Solution**: Already fixed in the current version. If you encounter this:
- Check `vite.config.ts` has only ONE `export default` statement
- Delete `.vite` cache folder and restart

#### 6. CORS Errors

**Problem**: Frontend can't connect to backend

**Solution**: Verify `backend\.env` has:
```env
WS_CORS_ORIGIN=http://localhost:3000
```

#### 7. Login Not Working

**Problem**: Users not created or wrong credentials

**Solution**:
```cmd
cd backend
node createSampleUsers-sqlite.js
cd ..
```

Use credentials from SAMPLE_LOGIN_CREDENTIALS.md

#### 8. WebSocket Connection Failed

**Problem**: Real-time features not working

**Solution**:
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify `vite.config.ts` has proxy configuration for `/socket.io`

---

## 💻 Development Guide

### Available Scripts

#### Frontend Scripts
```cmd
npm run dev          # Start development server
npm run client       # Start frontend only
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run tests
```

#### Backend Scripts
```cmd
cd backend
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
npm test             # Run backend tests
```

### Development Workflow

1. **Start Development Servers**
   ```cmd
   npm run dev
   ```

2. **Make Changes**
   - Frontend changes auto-reload (Vite HMR)
   - Backend changes auto-reload (nodemon)

3. **Test Your Changes**
   - Use browser DevTools
   - Check terminal for errors
   - Test API with Postman/Thunder Client

4. **Commit Changes**
   ```cmd
   git add .
   git commit -m "Your commit message"
   git push
   ```

### Adding New Features

#### 1. Add New API Endpoint

**Create route file**: `backend/routes/newFeature.js`
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  // Your logic here
  res.json({ success: true, data: [] });
});

module.exports = router;
```

**Register in server.js**:
```javascript
app.use('/api/newfeature', require('./routes/newFeature'));
```

#### 2. Add New React Component

**Create component**: `src/components/NewFeature.tsx`
```typescript
import React from 'react';

export const NewFeature: React.FC = () => {
  return (
    <div>
      <h1>New Feature</h1>
    </div>
  );
};
```

**Add route**: Update `src/App.tsx`
```typescript
<Route path="/new-feature" element={<NewFeature />} />
```

### Database Management

#### View Database Contents
```cmd
# Install SQLite browser or use command line
sqlite3 backend/database.sqlite

# List tables
.tables

# View users
SELECT * FROM users;

# Exit
.quit
```

#### Reset Database
```cmd
del backend\database.sqlite
cd backend
node createSampleUsers-sqlite.js
cd ..
```

### Environment Variables

#### Development (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-key
```

#### Production (.env.production)
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secure-secret-key-here
DB_HOST=your-production-db-host
```

---

## 🚀 Production Deployment

### Build for Production

```cmd
# Build frontend
npm run build

# This creates a 'dist' folder with optimized files
```

### Deploy Backend

1. **Set environment variables**
2. **Use PM2 for process management**
   ```cmd
   npm install -g pm2
   pm2 start backend/server.js --name tourist-api
   ```

3. **Use PostgreSQL for production**
   - Update `backend/config/database.js`
   - Set PostgreSQL connection details in `.env`

### Deploy Frontend

1. **Upload dist folder to web server**
2. **Configure nginx or Apache**
3. **Set up SSL certificate**

For detailed deployment instructions, see `DEPLOYMENT.md`

---

## 📊 Database Schema

### Users Table
```sql
- id (Primary Key)
- email (Unique)
- password (Hashed)
- name
- role (tourist, police, id_issuer, admin)
- status (active, pending, suspended)
- created_at
- updated_at
```

### Tourists Table
```sql
- id (Primary Key)
- user_id (Foreign Key -> Users)
- phone
- nationality
- passport_number
- emergency_contact
- current_location (JSON)
- safety_score
- created_at
- updated_at
```

### Devices Table
```sql
- id (Primary Key)
- device_id (Unique)
- tourist_id (Foreign Key -> Tourists)
- type (smart_band, tracker, sensor)
- status (online, offline, maintenance)
- battery_level
- last_sync
- vitals (JSON)
- created_at
- updated_at
```

### Alerts Table
```sql
- id (Primary Key)
- tourist_id (Foreign Key -> Tourists)
- type (emergency, medical, security)
- severity (low, medium, high, critical)
- status (active, acknowledged, resolved)
- location (JSON)
- message
- acknowledged_by
- resolved_by
- created_at
- resolved_at
```

---

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Password Hashing**: bcryptjs with 12 rounds
3. **Rate Limiting**: Prevent brute force attacks
4. **CORS Protection**: Configured origins
5. **Helmet Security**: HTTP security headers
6. **Input Validation**: Express-validator
7. **SQL Injection Protection**: Sequelize ORM
8. **XSS Protection**: React's built-in protection

---

## 📝 Testing

### Run All Tests
```cmd
npm test
```

### Run Frontend Tests
```cmd
npm run test:client
```

### Run Backend Tests
```cmd
cd backend
npm test
```

### Manual Testing Checklist

- [ ] User registration works
- [ ] Login with all roles works
- [ ] Admin can approve pending users
- [ ] Tourist can update profile
- [ ] Emergency alert triggers correctly
- [ ] Real-time notifications work
- [ ] IoT device monitoring displays data
- [ ] Location tracking updates
- [ ] WebSocket connection stable
- [ ] Logout clears session

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📞 Support & Resources

### Documentation
- **Main README**: `README.md`
- **Windows Setup**: `WINDOWS_SETUP_GUIDE.md`
- **Login Credentials**: `SAMPLE_LOGIN_CREDENTIALS.md`
- **Deployment**: `DEPLOYMENT.md`

### Useful Links
- Node.js Documentation: https://nodejs.org/docs
- React Documentation: https://react.dev
- Express.js Guide: https://expressjs.com
- Vite Documentation: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com
- Shadcn/ui: https://ui.shadcn.com

### Getting Help
- Check troubleshooting section above
- Review browser console for errors
- Check backend terminal for API errors
- Verify all dependencies are installed
- Ensure ports 3000 and 5000 are available

---

## 📄 License

This project is licensed under the MIT License.

---

## ✅ Quick Start Checklist

- [ ] Node.js v18+ installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Sample users created (`node createSampleUsers-sqlite.js`)
- [ ] Development servers started (`npm run dev`)
- [ ] Accessed http://localhost:3000 in browser
- [ ] Logged in with test credentials
- [ ] Explored different user roles

---

**🎉 You're all set! Happy coding!**

For questions or issues, refer to the troubleshooting section or check the documentation files.
