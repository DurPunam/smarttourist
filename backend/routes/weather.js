const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');

/**
 * @route   GET /api/weather/current
 * @desc    Get current weather for location
 * @access  Public
 */
router.get('/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const weather = await weatherService.getCurrentWeather(
      parseFloat(lat),
      parseFloat(lon)
    );

    res.json({
      success: true,
      data: weather,
    });
  } catch (error) {
    console.error('Get current weather error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/weather/forecast
 * @desc    Get weather forecast
 * @access  Public
 */
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon, days = 5 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const forecast = await weatherService.getWeatherForecast(
      parseFloat(lat),
      parseFloat(lon),
      parseInt(days)
    );

    res.json({
      success: true,
      data: forecast,
    });
  } catch (error) {
    console.error('Get forecast error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forecast data',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/weather/alerts
 * @desc    Get weather alerts for location
 * @access  Public
 */
router.get('/alerts', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const alerts = await weatherService.getWeatherAlerts(
      parseFloat(lat),
      parseFloat(lon)
    );

    res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error('Get weather alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather alerts',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/weather/safety
 * @desc    Check if weather is safe for travel
 * @access  Public
 */
router.get('/safety', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const safety = await weatherService.isSafeForTravel(
      parseFloat(lat),
      parseFloat(lon)
    );

    res.json({
      success: true,
      data: safety,
    });
  } catch (error) {
    console.error('Get weather safety error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check weather safety',
      error: error.message,
    });
  }
});

module.exports = router;
