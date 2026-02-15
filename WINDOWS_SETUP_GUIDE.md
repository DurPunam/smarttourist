# Windows Setup Guide - Smart Tourist Platform

## Quick Start Guide for Windows

### Prerequisites
1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **Git** (optional) - [Download here](https://git-scm.com/)

### Step 1: Install Dependencies

Open Command Prompt or PowerShell in the project root directory and run:

```cmd
cd smarttourist\Smart-Tourist-main
npm install
cd backend
npm install
cd ..
```

### Step 2: Database Setup

Good news! This project uses **SQLite** which requires no installation. The database file will be created automatically when you start the backend server.

### Step 3: Environment Configuration

The backend `.env` file is already configured. You can verify it at:
`smarttourist\Smart-Tourist-main\backend\.env`

Default configuration:
- Backend Port: 5000
- Frontend Port: 3000 (Vite default)
- Database: SQLite (no setup needed)

### Step 4: Create Sample Users (Optional)

To create test users for login, run:

```cmd
cd smarttourist\Smart-Tourist-main\backend
node createSampleUsers-sqlite.js
cd ..
```

### Step 5: Start the Application

#### Option A: Run Both Frontend and Backend Together (Recommended)

```cmd
cd smarttourist\Smart-Tourist-main
npm run dev
```

This will start:
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000

#### Option B: Run Frontend and Backend Separately

**Terminal 1 - Backend:**
```cmd
cd smarttourist\Smart-Tourist-main\backend
npm run dev
```

**Terminal 2 - Frontend:**
```cmd
cd smarttourist\Smart-Tourist-main
npm run client
```

### Step 6: Access the Application

Open your browser and go to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### Default Login Credentials

Check the file `SAMPLE_LOGIN_CREDENTIALS.md` for login details, or use the sample users created in Step 4.

## Troubleshooting

### Issue: "npm not found"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### Issue: Port already in use
- Change the port in `backend\.env` file
- Or kill the process using the port:
  ```cmd
  netstat -ano | findstr :5000
  taskkill /PID <PID_NUMBER> /F
  ```

### Issue: Module not found errors
- Delete `node_modules` folders and reinstall:
  ```cmd
  rmdir /s /q node_modules
  cd backend
  rmdir /s /q node_modules
  cd ..
  npm install
  cd backend
  npm install
  cd ..
  ```

### Issue: SQLite database errors
- Delete the database file and restart:
  ```cmd
  del smarttourist\Smart-Tourist-main\backend\database.sqlite
  ```

## Project Structure

```
smarttourist/Smart-Tourist-main/
├── backend/              # Node.js/Express backend
│   ├── config/          # Database configuration
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error handling
│   ├── server.js        # Main server file
│   └── database.sqlite  # SQLite database (auto-created)
├── src/                 # React frontend
│   ├── components/      # React components
│   ├── App.tsx         # Main app component
│   └── ...
├── package.json         # Frontend dependencies
└── vite.config.ts      # Vite configuration
```

## Available Scripts

- `npm run dev` - Run both frontend and backend
- `npm run client` - Run frontend only
- `npm run server` - Run backend only
- `npm run build` - Build for production
- `npm run lint` - Run linter

## Next Steps

1. Explore the admin dashboard
2. Test the tourist safety features
3. Check the IoT monitoring system
4. Review the API documentation in README.md

## Support

For issues or questions, check:
- Main README.md for detailed documentation
- SAMPLE_LOGIN_CREDENTIALS.md for login info
- Backend logs in the terminal for errors
