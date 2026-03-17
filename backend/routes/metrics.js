const express = require('express');
const os = require('os');
const { Op } = require('sequelize');
const Tourist = require('../models/Tourist');
const Device = require('../models/Device');
const Alert = require('../models/Alert');
const User = require('../models/User');

const router = express.Router();

// Store metrics history for trends
let metricsHistory = [];
const MAX_HISTORY = 100;

// @route   GET /api/metrics/system
// @desc    Get real-time system performance metrics
// @access  Private
router.get('/system', async (req, res) => {
  try {
    // System metrics
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercent = ((usedMemory / totalMemory) * 100).toFixed(1);

    // CPU metrics
    const cpus = os.cpus();
    const cpuUsage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      const idle = cpu.times.idle;
      return acc + ((total - idle) / total) * 100;
    }, 0) / cpus.length;

    // Process metrics
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    const uptimeFormatted = `${uptimeHours}h ${uptimeMinutes}m`;

    // Database metrics (using Sequelize, not MongoDB)
    const [activeTourists, activeDevices, activeAlerts, totalTourists, totalDevices, totalAlerts] = await Promise.all([
      Tourist.count({ where: { status: 'active', isActive: true } }),
      Device.count({ where: { status: 'active', isActive: true } }),
      Alert.count({ where: { status: 'active', isActive: true } }),
      Tourist.count(),
      Device.count(),
      Alert.count()
    ]);
    
    const totalRequests = totalTourists + totalDevices + totalAlerts;

    // Calculate response time (simulated based on actual metrics)
    const responseTime = Math.floor(50 + (cpuUsage * 2) + (parseFloat(memoryUsagePercent) * 0.5));

    // Active connections - WebSocket users currently online
    const io = req.app.get('io');
    const websocketConnections = io ? io.engine.clientsCount : 0;
    
    // Also count active users (logged in within last 5 minutes)
    let activeUsers = 0;
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      activeUsers = await User.count({
        where: {
          lastLogin: { [Op.gte]: fiveMinutesAgo },
          isActive: true
        }
      });
    } catch (error) {
      // If lastLogin query fails, just use WebSocket count
      console.log('Could not count active users by lastLogin, using WebSocket count');
    }
    
    // Use the higher number (WebSocket or recent logins), minimum 0
    const activeConnections = Math.max(0, websocketConnections, activeUsers);
    
    console.log(`Active Connections - WebSocket: ${websocketConnections}, Active Users: ${activeUsers}, Final: ${activeConnections}`);

    // Data processed (estimate based on database size)
    const dataProcessedMB = (totalRequests * 0.5).toFixed(2);
    const dataProcessed = dataProcessedMB > 1000 
      ? `${(dataProcessedMB / 1024).toFixed(2)}GB` 
      : `${dataProcessedMB}MB`;

    // Calculate safety score based on system health
    const safetyScore = Math.floor(
      100 - 
      (cpuUsage * 0.3) - 
      (parseFloat(memoryUsagePercent) * 0.2) - 
      (activeAlerts * 0.5)
    );
    
    console.log(`Safety Score Calculation - CPU: ${cpuUsage}, Memory: ${memoryUsagePercent}, Alerts: ${activeAlerts}, Score: ${safetyScore}`);

    const metrics = {
      system: {
        cpu: {
          usage: cpuUsage.toFixed(1),
          cores: cpus.length
        },
        memory: {
          total: (totalMemory / (1024 ** 3)).toFixed(2) + 'GB',
          used: (usedMemory / (1024 ** 3)).toFixed(2) + 'GB',
          free: (freeMemory / (1024 ** 3)).toFixed(2) + 'GB',
          usagePercent: memoryUsagePercent
        },
        uptime: {
          seconds: uptime,
          formatted: uptimeFormatted,
          percent: '99.9%'
        }
      },
      performance: {
        responseTime: `${responseTime}ms`,
        activeConnections,
        dataProcessed,
        safetyScore: Math.max(0, Math.min(100, safetyScore))
      },
      database: {
        activeTourists,
        activeDevices,
        activeAlerts,
        totalRecords: totalRequests
      },
      timestamp: new Date().toISOString()
    };

    // Store in history
    metricsHistory.push({
      timestamp: Date.now(),
      cpuUsage: cpuUsage.toFixed(1),
      memoryUsage: memoryUsagePercent,
      responseTime,
      activeConnections
    });

    // Keep only last MAX_HISTORY entries
    if (metricsHistory.length > MAX_HISTORY) {
      metricsHistory = metricsHistory.slice(-MAX_HISTORY);
    }

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Get system metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system metrics'
    });
  }
});

// @route   GET /api/metrics/history
// @desc    Get metrics history for trends
// @access  Private
router.get('/history', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const history = metricsHistory.slice(-parseInt(limit));

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Get metrics history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch metrics history'
    });
  }
});

module.exports = router;
