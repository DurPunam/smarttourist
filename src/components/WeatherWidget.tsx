import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  Wind, 
  Droplets, 
  Eye,
  AlertTriangle,
  Loader2,
  MapPin
} from 'lucide-react';
import apiClient from '@/utils/apiClient';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  windSpeed: number;
  visibility: number;
  location: string;
  country: string;
  timestamp: string;
  isMock?: boolean;
}

interface WeatherSafety {
  isSafe: boolean;
  warnings: string[];
  recommendations: string[];
}

interface WeatherWidgetProps {
  lat?: number;
  lon?: number;
  showSafety?: boolean;
  compact?: boolean;
}

export function WeatherWidget({ 
  lat, 
  lon, 
  showSafety = false,
  compact = false 
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [safety, setSafety] = useState<WeatherSafety | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Get user location if not provided
  useEffect(() => {
    if (lat && lon) {
      setUserLocation({ lat, lon });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Location error:', error);
          // Use default location (Delhi)
          setUserLocation({ lat: 28.6139, lon: 77.209 });
        }
      );
    } else {
      // Use default location
      setUserLocation({ lat: 28.6139, lon: 77.209 });
    }
  }, [lat, lon]);

  // Fetch weather data
  useEffect(() => {
    if (!userLocation) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current weather
        const weatherResponse = await apiClient.get(
          `/weather/current?lat=${userLocation.lat}&lon=${userLocation.lon}`
        );

        if (weatherResponse.data.success) {
          setWeather(weatherResponse.data.data);
        }

        // Fetch safety info if requested
        if (showSafety) {
          const safetyResponse = await apiClient.get(
            `/weather/safety?lat=${userLocation.lat}&lon=${userLocation.lon}`
          );

          if (safetyResponse.data.success) {
            setSafety(safetyResponse.data.data);
          }
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userLocation, showSafety]);

  const getWeatherIcon = (iconCode: string) => {
    const code = iconCode?.substring(0, 2);
    switch (code) {
      case '01':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case '02':
      case '03':
      case '04':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case '09':
      case '10':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case '13':
        return <CloudSnow className="w-8 h-8 text-blue-300" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <Card className={compact ? 'shadow-sm' : ''}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Loading weather...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className={compact ? 'shadow-sm' : ''}>
        <CardContent className="p-6">
          <div className="text-center text-sm text-muted-foreground">
            {error || 'Weather data unavailable'}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getWeatherIcon(weather.icon)}
              <div>
                <div className="text-2xl font-bold">{Math.round(weather.temperature)}°C</div>
                <div className="text-xs text-muted-foreground capitalize">{weather.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-xs text-muted-foreground mb-1">
                <MapPin className="w-3 h-3 mr-1" />
                {weather.location}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Droplets className="w-3 h-3 mr-1" />
                {weather.humidity}%
              </div>
            </div>
          </div>
          {weather.isMock && (
            <Badge variant="outline" className="mt-2 text-xs">
              Demo Data
            </Badge>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weather Conditions</span>
          {weather.isMock && (
            <Badge variant="outline" className="text-xs">
              Demo Data - Add API Key
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Weather Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getWeatherIcon(weather.icon)}
            <div>
              <div className="text-4xl font-bold">{Math.round(weather.temperature)}°C</div>
              <div className="text-sm text-muted-foreground">
                Feels like {Math.round(weather.feelsLike)}°C
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <MapPin className="w-4 h-4 mr-1" />
              {weather.location}, {weather.country}
            </div>
            <div className="text-lg font-semibold capitalize">{weather.description}</div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-xs text-muted-foreground">Humidity</div>
              <div className="font-semibold">{weather.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-xs text-muted-foreground">Wind Speed</div>
              <div className="font-semibold">{weather.windSpeed} m/s</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-purple-500" />
            <div>
              <div className="text-xs text-muted-foreground">Visibility</div>
              <div className="font-semibold">{(weather.visibility / 1000).toFixed(1)} km</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Cloud className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-xs text-muted-foreground">Pressure</div>
              <div className="font-semibold">{weather.pressure} hPa</div>
            </div>
          </div>
        </div>

        {/* Safety Information */}
        {showSafety && safety && (
          <div className="pt-4 border-t space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Travel Safety</span>
              <Badge variant={safety.isSafe ? 'default' : 'destructive'}>
                {safety.isSafe ? 'Safe' : 'Caution'}
              </Badge>
            </div>

            {safety.warnings.length > 0 && (
              <div className="space-y-2">
                {safety.warnings.map((warning, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{warning}</span>
                  </div>
                ))}
              </div>
            )}

            {safety.recommendations.length > 0 && (
              <div className="space-y-2">
                {safety.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Last updated: {new Date(weather.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}
