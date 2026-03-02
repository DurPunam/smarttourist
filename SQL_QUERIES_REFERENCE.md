# 📊 SQL Queries Reference - Smart Tourist Safety Platform

This document shows the actual SQL queries used in the project.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  role TEXT CHECK(role IN ('tourist', 'admin', 'police', 'id_issuer')) DEFAULT 'tourist',
  status TEXT CHECK(status IN ('active', 'pending', 'suspended')) DEFAULT 'active',
  department VARCHAR,
  badgeNumber VARCHAR UNIQUE,
  location VARCHAR,
  approvedBy TEXT,
  approvedAt DATETIME,
  avatar VARCHAR,
  isActive BOOLEAN DEFAULT 1,
  isVerified BOOLEAN DEFAULT 0,
  lastLogin DATETIME,
  loginAttempts INTEGER DEFAULT 0,
  lockUntil DATETIME,
  preferences TEXT,
  metadata TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tourists Table
```sql
CREATE TABLE tourists (
  id TEXT PRIMARY KEY,
  userId TEXT UNIQUE,
  touristId VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone VARCHAR(20),
  nationality VARCHAR(50),
  passportNumber VARCHAR(50) UNIQUE,
  visaNumber VARCHAR(50),
  visaExpiry DATE,
  dateOfBirth DATE,
  gender TEXT CHECK(gender IN ('male', 'female', 'other')),
  address TEXT,
  emergencyContact TEXT,
  currentLocation TEXT,
  lastKnownLocation TEXT,
  locationUpdatedAt DATETIME,
  status TEXT CHECK(status IN ('active', 'inactive', 'emergency', 'departed')) DEFAULT 'active',
  riskLevel TEXT CHECK(riskLevel IN ('low', 'medium', 'high', 'critical')) DEFAULT 'low',
  qrCode TEXT,
  photo VARCHAR,
  documents TEXT,
  travelItinerary TEXT,
  checkInDate DATE,
  checkOutDate DATE,
  accommodation TEXT,
  isActive BOOLEAN DEFAULT 1,
  metadata TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### Devices Table
```sql
CREATE TABLE devices (
  id TEXT PRIMARY KEY,
  deviceId VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  type TEXT CHECK(type IN ('camera', 'sensor', 'beacon', 'emergency_button', 'weather_station', 'traffic_monitor')) NOT NULL,
  location TEXT NOT NULL,
  coordinates TEXT,
  status TEXT CHECK(status IN ('online', 'offline', 'maintenance', 'error')) DEFAULT 'online',
  lastPing DATETIME,
  batteryLevel INTEGER,
  signalStrength INTEGER,
  firmware VARCHAR(20),
  ipAddress VARCHAR(45),
  macAddress VARCHAR(17),
  manufacturer VARCHAR(100),
  model VARCHAR(100),
  installDate DATE,
  lastMaintenance DATE,
  nextMaintenance DATE,
  assignedTo TEXT,
  configuration TEXT,
  metrics TEXT,
  alerts TEXT,
  isActive BOOLEAN DEFAULT 1,
  metadata TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Alerts Table
```sql
CREATE TABLE alerts (
  id TEXT PRIMARY KEY,
  touristId TEXT,
  deviceId TEXT,
  type TEXT CHECK(type IN ('emergency', 'medical', 'security', 'weather', 'traffic', 'system')) NOT NULL,
  severity TEXT CHECK(severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  title VARCHAR(200) NOT NULL,
  description TEXT,
  location TEXT,
  coordinates TEXT,
  status TEXT CHECK(status IN ('active', 'acknowledged', 'resolved', 'dismissed')) DEFAULT 'active',
  priority INTEGER DEFAULT 1,
  assignedTo TEXT,
  acknowledgedBy TEXT,
  acknowledgedAt DATETIME,
  resolvedBy TEXT,
  resolvedAt DATETIME,
  resolution TEXT,
  notificationsSent TEXT,
  affectedArea TEXT,
  estimatedImpact TEXT,
  responseTime INTEGER,
  attachments TEXT,
  relatedAlerts TEXT,
  metadata TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (touristId) REFERENCES tourists(id),
  FOREIGN KEY (deviceId) REFERENCES devices(id)
);
```

---

## Common SQL Queries Used in the Application

### Authentication Queries

#### 1. User Registration
```sql
-- Check if user exists
SELECT * FROM users WHERE email = 'user@example.com';

-- Create new user
INSERT INTO users (id, name, email, password, role, status, createdAt, updatedAt)
VALUES ('uuid-here', 'John Doe', 'john@example.com', 'hashed_password', 'tourist', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

#### 2. User Login
```sql
-- Find user by email
SELECT * FROM users WHERE email = 'admin@touristsafety.gov.in';

-- Update last login time
UPDATE users 
SET lastLogin = CURRENT_TIMESTAMP, loginAttempts = 0, lockUntil = NULL
WHERE id = 'user-id';
```

#### 3. Failed Login Attempt
```sql
-- Increment login attempts
UPDATE users 
SET loginAttempts = loginAttempts + 1
WHERE id = 'user-id';

-- Lock account after 5 failed attempts
UPDATE users 
SET lockUntil = datetime('now', '+2 hours')
WHERE id = 'user-id' AND loginAttempts >= 5;
```

---

### Tourist Management Queries

#### 4. Get All Tourists (with pagination)
```sql
SELECT * FROM tourists 
WHERE isActive = 1
ORDER BY createdAt DESC
LIMIT 10 OFFSET 0;

-- Count total tourists
SELECT COUNT(*) as total FROM tourists WHERE isActive = 1;
```

#### 5. Get Tourist by ID
```sql
SELECT t.*, u.name as userName, u.email as userEmail, u.role as userRole
FROM tourists t
LEFT JOIN users u ON t.userId = u.id
WHERE t.id = 'tourist-id';
```

#### 6. Search Tourists
```sql
SELECT * FROM tourists 
WHERE isActive = 1 
  AND (name LIKE '%search%' OR email LIKE '%search%' OR touristId LIKE '%search%')
ORDER BY createdAt DESC;
```

#### 7. Filter Tourists by Status and Risk Level
```sql
SELECT * FROM tourists 
WHERE isActive = 1 
  AND status = 'active' 
  AND riskLevel = 'high'
ORDER BY locationUpdatedAt DESC;
```

#### 8. Update Tourist Location
```sql
UPDATE tourists 
SET currentLocation = '{"lat": 28.6139, "lng": 77.2090}',
    lastKnownLocation = '{"lat": 28.6139, "lng": 77.2090}',
    locationUpdatedAt = CURRENT_TIMESTAMP
WHERE id = 'tourist-id';
```

#### 9. Create Tourist Profile
```sql
INSERT INTO tourists (
  id, userId, touristId, name, email, phone, nationality, 
  passportNumber, status, riskLevel, qrCode, createdAt, updatedAt
)
VALUES (
  'uuid', 'user-id', 'TST001', 'John Doe', 'john@example.com', 
  '+91-9876543210', 'USA', 'P123456', 'active', 'low', 
  'qr-code-data', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);
```

---

### IoT Device Queries

#### 10. Get All Active Devices
```sql
SELECT * FROM devices 
WHERE isActive = 1 
  AND status = 'online'
ORDER BY lastPing DESC;
```

#### 11. Get Devices by Type
```sql
SELECT * FROM devices 
WHERE type = 'camera' 
  AND status = 'online'
ORDER BY location;
```

#### 12. Update Device Status
```sql
UPDATE devices 
SET status = 'online',
    lastPing = CURRENT_TIMESTAMP,
    batteryLevel = 85,
    signalStrength = 90
WHERE deviceId = 'CAM-001';
```

#### 13. Get Device Statistics
```sql
-- Count devices by status
SELECT status, COUNT(*) as count 
FROM devices 
WHERE isActive = 1
GROUP BY status;

-- Count devices by type
SELECT type, COUNT(*) as count 
FROM devices 
WHERE isActive = 1
GROUP BY type;
```

#### 14. Get Offline Devices
```sql
SELECT * FROM devices 
WHERE status = 'offline' 
  OR lastPing < datetime('now', '-5 minutes')
ORDER BY lastPing ASC;
```

---

### Alert Management Queries

#### 15. Get All Active Alerts
```sql
SELECT a.*, t.name as touristName, t.touristId, d.name as deviceName
FROM alerts a
LEFT JOIN tourists t ON a.touristId = t.id
LEFT JOIN devices d ON a.deviceId = d.id
WHERE a.status = 'active'
ORDER BY a.severity DESC, a.createdAt DESC;
```

#### 16. Create Emergency Alert
```sql
INSERT INTO alerts (
  id, touristId, type, severity, title, description, 
  location, coordinates, status, priority, createdAt, updatedAt
)
VALUES (
  'uuid', 'tourist-id', 'emergency', 'critical', 
  'Tourist in Distress', 'Emergency button pressed', 
  'India Gate, New Delhi', '{"lat": 28.6129, "lng": 77.2295}',
  'active', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);
```

#### 17. Acknowledge Alert
```sql
UPDATE alerts 
SET status = 'acknowledged',
    acknowledgedBy = 'admin-id',
    acknowledgedAt = CURRENT_TIMESTAMP
WHERE id = 'alert-id';
```

#### 18. Resolve Alert
```sql
UPDATE alerts 
SET status = 'resolved',
    resolvedBy = 'admin-id',
    resolvedAt = CURRENT_TIMESTAMP,
    resolution = 'Tourist safely rescued and taken to hospital'
WHERE id = 'alert-id';
```

#### 19. Get Alert Statistics
```sql
-- Count alerts by severity
SELECT severity, COUNT(*) as count 
FROM alerts 
WHERE status = 'active'
GROUP BY severity;

-- Count alerts by type
SELECT type, COUNT(*) as count 
FROM alerts 
WHERE createdAt >= date('now', '-7 days')
GROUP BY type;
```

#### 20. Get Recent Alerts for Tourist
```sql
SELECT * FROM alerts 
WHERE touristId = 'tourist-id'
ORDER BY createdAt DESC
LIMIT 10;
```

---

### Dashboard Statistics Queries

#### 21. Get Total Counts
```sql
-- Total active tourists
SELECT COUNT(*) as totalTourists FROM tourists WHERE isActive = 1 AND status = 'active';

-- Total active alerts
SELECT COUNT(*) as totalAlerts FROM alerts WHERE status = 'active';

-- Total online devices
SELECT COUNT(*) as totalDevices FROM devices WHERE status = 'online';

-- Total users
SELECT COUNT(*) as totalUsers FROM users WHERE isActive = 1;
```

#### 22. Get High-Risk Tourists
```sql
SELECT * FROM tourists 
WHERE riskLevel IN ('high', 'critical') 
  AND status = 'active'
ORDER BY locationUpdatedAt DESC;
```

#### 23. Get Recent Activity
```sql
-- Recent alerts
SELECT * FROM alerts 
ORDER BY createdAt DESC 
LIMIT 5;

-- Recent tourist registrations
SELECT * FROM tourists 
ORDER BY createdAt DESC 
LIMIT 5;
```

#### 24. Get Tourists by Nationality
```sql
SELECT nationality, COUNT(*) as count 
FROM tourists 
WHERE isActive = 1
GROUP BY nationality
ORDER BY count DESC;
```

---

### Admin Approval Queries

#### 25. Get Pending Users
```sql
SELECT * FROM users 
WHERE status = 'pending' 
  AND role IN ('police', 'id_issuer')
ORDER BY createdAt ASC;
```

#### 26. Approve User
```sql
UPDATE users 
SET status = 'active',
    approvedBy = 'admin-id',
    approvedAt = CURRENT_TIMESTAMP
WHERE id = 'user-id';
```

#### 27. Reject User
```sql
UPDATE users 
SET status = 'suspended',
    rejectionReason = 'Invalid credentials provided'
WHERE id = 'user-id';
```

---

### Location Tracking Queries

#### 28. Get Tourists Near Location
```sql
-- Note: SQLite doesn't have built-in geospatial functions
-- This is a simplified version
SELECT * FROM tourists 
WHERE isActive = 1 
  AND status = 'active'
  AND currentLocation IS NOT NULL
ORDER BY locationUpdatedAt DESC;
```

#### 29. Get Tourist Movement History
```sql
-- This would require a separate location_history table
SELECT * FROM location_history 
WHERE touristId = 'tourist-id'
ORDER BY timestamp DESC
LIMIT 50;
```

---

## Advanced Queries

#### 30. Get Dashboard Summary (Multiple Joins)
```sql
SELECT 
  (SELECT COUNT(*) FROM tourists WHERE isActive = 1) as totalTourists,
  (SELECT COUNT(*) FROM tourists WHERE status = 'active') as activeTourists,
  (SELECT COUNT(*) FROM alerts WHERE status = 'active') as activeAlerts,
  (SELECT COUNT(*) FROM alerts WHERE severity = 'critical') as criticalAlerts,
  (SELECT COUNT(*) FROM devices WHERE status = 'online') as onlineDevices,
  (SELECT COUNT(*) FROM devices WHERE status = 'offline') as offlineDevices;
```

#### 31. Get Alert Response Time Statistics
```sql
SELECT 
  AVG(CAST((julianday(acknowledgedAt) - julianday(createdAt)) * 24 * 60 AS INTEGER)) as avgResponseMinutes,
  MIN(CAST((julianday(acknowledgedAt) - julianday(createdAt)) * 24 * 60 AS INTEGER)) as minResponseMinutes,
  MAX(CAST((julianday(acknowledgedAt) - julianday(createdAt)) * 24 * 60 AS INTEGER)) as maxResponseMinutes
FROM alerts 
WHERE acknowledgedAt IS NOT NULL;
```

#### 32. Get Tourist Risk Distribution
```sql
SELECT 
  riskLevel,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tourists WHERE isActive = 1), 2) as percentage
FROM tourists 
WHERE isActive = 1
GROUP BY riskLevel;
```

---

## Transaction Examples

#### 33. Create Tourist with User (Transaction)
```sql
BEGIN TRANSACTION;

-- Create user
INSERT INTO users (id, name, email, password, role, createdAt, updatedAt)
VALUES ('user-uuid', 'John Doe', 'john@example.com', 'hashed_password', 'tourist', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Create tourist profile
INSERT INTO tourists (id, userId, touristId, name, email, nationality, status, createdAt, updatedAt)
VALUES ('tourist-uuid', 'user-uuid', 'TST001', 'John Doe', 'john@example.com', 'USA', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

COMMIT;
```

#### 34. Emergency Alert with Location Update (Transaction)
```sql
BEGIN TRANSACTION;

-- Update tourist status
UPDATE tourists 
SET status = 'emergency', 
    riskLevel = 'critical',
    locationUpdatedAt = CURRENT_TIMESTAMP
WHERE id = 'tourist-id';

-- Create alert
INSERT INTO alerts (id, touristId, type, severity, title, status, createdAt, updatedAt)
VALUES ('alert-uuid', 'tourist-id', 'emergency', 'critical', 'Emergency Alert', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

COMMIT;
```

---

## Indexes for Performance

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Tourist indexes
CREATE INDEX idx_tourists_userId ON tourists(userId);
CREATE INDEX idx_tourists_touristId ON tourists(touristId);
CREATE INDEX idx_tourists_status ON tourists(status);
CREATE INDEX idx_tourists_riskLevel ON tourists(riskLevel);
CREATE INDEX idx_tourists_locationUpdatedAt ON tourists(locationUpdatedAt);

-- Device indexes
CREATE INDEX idx_devices_deviceId ON devices(deviceId);
CREATE INDEX idx_devices_type ON devices(type);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_lastPing ON devices(lastPing);

-- Alert indexes
CREATE INDEX idx_alerts_touristId ON alerts(touristId);
CREATE INDEX idx_alerts_deviceId ON alerts(deviceId);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_createdAt ON alerts(createdAt);
```

---

## Notes for Faculty Presentation

1. **ORM vs Raw SQL**: The project uses Sequelize ORM which automatically converts JavaScript code to SQL queries
2. **Database**: SQLite is used for easy deployment and portability
3. **Security**: All passwords are hashed using bcrypt before storing
4. **Transactions**: Used for operations that need to maintain data consistency
5. **Indexes**: Created on frequently queried columns for better performance
6. **Real-time**: WebSocket (Socket.io) is used alongside SQL for real-time features

---

**Generated for**: Smart Tourist Safety Platform  
**Database**: SQLite3  
**ORM**: Sequelize 6.37.7
