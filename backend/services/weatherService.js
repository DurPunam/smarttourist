const axios = require('axios');
const NodeCache = require('node-cache');

class WeatherService {
  constructor() {
    // Open-Meteo API - FREE, no API key required!
    this.baseUrl = 'https://api.open-meteo.com/v1';
    // Cache weather data for 10 minutes
    this.cache = new NodeCache({ stdTTL: 600 });
  }

  /**
   * Get current weather for location using Open-Meteo API
   */
  async getCurrentWeather(lat, lon) {
    const cacheKey = `weather_${lat}_${lon}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m',
          timezone: 'auto'
        },
      });

      const current = response.data.current;
      const weatherData = {
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl,
        description: this.getWeatherDescription(current.weather_code),
        icon: this.getWeatherIcon(current.weather_code),
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        precipitation: current.precipitation,
        visibility: 10000, // Open-Meteo doesn't provide visibility, default to 10km
        location: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
        country: '',
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
   * Get weather forecast using Open-Meteo API
   */
  async getWeatherForecast(lat, lon, days = 7) {
    const cacheKey = `forecast_${lat}_${lon}_${days}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          latitude: lat,
          longitude: lon,
          daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max',
          timezone: 'auto',
          forecast_days: days
        },
      });

      const daily = response.data.daily;
      const forecast = daily.time.map((time, index) => ({
        timestamp: new Date(time),
        temperatureMax: daily.temperature_2m_max[index],
        temperatureMin: daily.temperature_2m_min[index],
        temperature: (daily.temperature_2m_max[index] + daily.temperature_2m_min[index]) / 2,
        description: this.getWeatherDescription(daily.weather_code[index]),
        icon: this.getWeatherIcon(daily.weather_code[index]),
        precipitation: daily.precipitation_sum[index],
        windSpeed: daily.wind_speed_10m_max[index],
      }));

      this.cache.set(cacheKey, forecast);
      return forecast;
    } catch (error) {
      console.error('Forecast API error:', error.message);
      return this.getMockForecastData(lat, lon, days);
    }
  }

  /**
   * Get weather alerts (Open-Meteo doesn't provide alerts, return empty)
   */
  async getWeatherAlerts(lat, lon) {
    // Open-Meteo doesn't provide weather alerts
    // You could integrate with another service for alerts if needed
    return [];
  }

  /**
   * Check if weather is safe for travel
   */
  async isSafeForTravel(lat, lon) {
    const weather = await this.getCurrentWeather(lat, lon);

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

    // Check precipitation
    if (weather.precipitation > 5) {
      safetyChecks.warnings.push('Heavy rain warning');
      safetyChecks.recommendations.push('Carry umbrella and avoid flood-prone areas');
    }

    // Check weather code for severe conditions
    const weatherCode = this.getWeatherCodeFromDescription(weather.description);
    if (weatherCode >= 95) { // Thunderstorm
      safetyChecks.isSafe = false;
      safetyChecks.warnings.push('Thunderstorm warning');
      safetyChecks.recommendations.push('Stay indoors and avoid travel');
    }

    return safetyChecks;
  }

  /**
   * Convert WMO weather code to description
   * WMO Weather interpretation codes (WW)
   */
  getWeatherDescription(code) {
    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };

    return weatherCodes[code] || 'Unknown';
  }

  /**
   * Convert WMO weather code to icon code
   */
  getWeatherIcon(code) {
    if (code === 0) return '01d'; // Clear sky
    if (code >= 1 && code <= 3) return '02d'; // Partly cloudy
    if (code >= 45 && code <= 48) return '50d'; // Fog
    if (code >= 51 && code <= 67) return '10d'; // Rain
    if (code >= 71 && code <= 77) return '13d'; // Snow
    if (code >= 80 && code <= 82) return '09d'; // Showers
    if (code >= 85 && code <= 86) return '13d'; // Snow showers
    if (code >= 95 && code <= 99) return '11d'; // Thunderstorm
    return '01d'; // Default
  }

  /**
   * Get weather code from description (reverse lookup)
   */
  getWeatherCodeFromDescription(description) {
    const desc = description.toLowerCase();
    if (desc.includes('thunder')) return 95;
    if (desc.includes('heavy rain')) return 65;
    if (desc.includes('rain')) return 61;
    if (desc.includes('snow')) return 71;
    if (desc.includes('clear')) return 0;
    return 1;
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
      windDirection: 180,
      precipitation: 0,
      visibility: 10000,
      location: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
      country: '',
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

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      
      forecast.push({
        timestamp: date,
        temperature: 20 + Math.random() * 10,
        temperatureMax: 25 + Math.random() * 5,
        temperatureMin: 15 + Math.random() * 5,
        description: 'Partly cloudy',
        icon: '02d',
        precipitation: Math.random() * 5,
        windSpeed: 3 + Math.random() * 5,
        isMock: true,
      });
    }

    return forecast;
  }
}

// Export singleton instance
module.exports = new WeatherService();
