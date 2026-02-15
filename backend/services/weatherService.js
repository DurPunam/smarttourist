const axios = require('axios');
const NodeCache = require('node-cache');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    // Cache weather data for 10 minutes
    this.cache = new NodeCache({ stdTTL: 600 });
  }

  /**
   * Get current weather for location
   */
  async getCurrentWeather(lat, lon) {
    const cacheKey = `weather_${lat}_${lon}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    if (!this.apiKey) {
      return this.getMockWeatherData(lat, lon);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
        },
      });

      const weatherData = {
        temperature: response.data.main.temp,
        feelsLike: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        windSpeed: response.data.wind.speed,
        visibility: response.data.visibility,
        location: response.data.name,
        country: response.data.sys.country,
        timestamp: new Date(),
      };

      this.cache.set(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      console.error('Weather API error:', error.message);
      return this.getMockWeatherData(lat, lon);
    }
  }

  /**
   * Get weather forecast
   */
  async getWeatherForecast(lat, lon, days = 5) {
    const cacheKey = `forecast_${lat}_${lon}_${days}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    if (!this.apiKey) {
      return this.getMockForecastData(lat, lon, days);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          cnt: days * 8, // 8 forecasts per day (3-hour intervals)
        },
      });

      const forecast = response.data.list.map((item) => ({
        timestamp: new Date(item.dt * 1000),
        temperature: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        precipitation: item.pop * 100, // Probability of precipitation
      }));

      this.cache.set(cacheKey, forecast);
      return forecast;
    } catch (error) {
      console.error('Forecast API error:', error.message);
      return this.getMockForecastData(lat, lon, days);
    }
  }

  /**
   * Get weather alerts
   */
  async getWeatherAlerts(lat, lon) {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await axios.get(`${this.baseUrl}/onecall`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          exclude: 'minutely,hourly,daily',
        },
      });

      if (response.data.alerts) {
        return response.data.alerts.map((alert) => ({
          event: alert.event,
          start: new Date(alert.start * 1000),
          end: new Date(alert.end * 1000),
          description: alert.description,
          severity: this.determineSeverity(alert.event),
          tags: alert.tags || [],
        }));
      }

      return [];
    } catch (error) {
      console.error('Weather alerts error:', error.message);
      return [];
    }
  }

  /**
   * Check if weather is safe for travel
   */
  async isSafeForTravel(lat, lon) {
    const weather = await this.getCurrentWeather(lat, lon);
    const alerts = await this.getWeatherAlerts(lat, lon);

    const safetyChecks = {
      isSafe: true,
      warnings: [],
      recommendations: [],
    };

    // Check temperature
    if (weather.temperature > 40) {
      safetyChecks.isSafe = false;
      safetyChecks.warnings.push('Extreme heat warning');
      safetyChecks.recommendations.push('Stay hydrated and avoid outdoor activities');
    } else if (weather.temperature < 5) {
      safetyChecks.warnings.push('Cold weather advisory');
      safetyChecks.recommendations.push('Dress warmly');
    }

    // Check wind speed
    if (weather.windSpeed > 15) {
      safetyChecks.warnings.push('High wind warning');
      safetyChecks.recommendations.push('Be cautious outdoors');
    }

    // Check visibility
    if (weather.visibility < 1000) {
      safetyChecks.isSafe = false;
      safetyChecks.warnings.push('Low visibility');
      safetyChecks.recommendations.push('Avoid travel if possible');
    }

    // Check alerts
    if (alerts.length > 0) {
      const criticalAlerts = alerts.filter((a) => a.severity === 'critical');
      if (criticalAlerts.length > 0) {
        safetyChecks.isSafe = false;
      }
      safetyChecks.warnings.push(...alerts.map((a) => a.event));
    }

    return safetyChecks;
  }

  /**
   * Determine alert severity
   */
  determineSeverity(event) {
    const critical = ['hurricane', 'tornado', 'flood', 'tsunami', 'earthquake'];
    const high = ['storm', 'heavy rain', 'snow', 'extreme heat', 'extreme cold'];
    const medium = ['wind', 'fog', 'dust', 'smoke'];

    const eventLower = event.toLowerCase();

    if (critical.some((word) => eventLower.includes(word))) {
      return 'critical';
    } else if (high.some((word) => eventLower.includes(word))) {
      return 'high';
    } else if (medium.some((word) => eventLower.includes(word))) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Get mock weather data (fallback)
   */
  getMockWeatherData(lat, lon) {
    return {
      temperature: 25,
      feelsLike: 27,
      humidity: 60,
      pressure: 1013,
      description: 'Clear sky',
      icon: '01d',
      windSpeed: 5,
      visibility: 10000,
      location: 'Location',
      country: 'IN',
      timestamp: new Date(),
      isMock: true,
    };
  }

  /**
   * Get mock forecast data (fallback)
   */
  getMockForecastData(lat, lon, days) {
    const forecast = [];
    const now = new Date();

    for (let i = 0; i < days * 8; i++) {
      forecast.push({
        timestamp: new Date(now.getTime() + i * 3 * 60 * 60 * 1000),
        temperature: 20 + Math.random() * 10,
        description: 'Partly cloudy',
        icon: '02d',
        humidity: 50 + Math.random() * 30,
        windSpeed: 3 + Math.random() * 5,
        precipitation: Math.random() * 30,
        isMock: true,
      });
    }

    return forecast;
  }
}

// Export singleton instance
module.exports = new WeatherService();
