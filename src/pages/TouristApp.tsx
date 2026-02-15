import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertCircle, 
  Shield, 
  MapPin, 
  Phone,
  Globe,
  Volume2,
  Settings,
  ChevronRight,
  Zap,
  Heart,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContextImproved';
import apiClient from '@/utils/apiClient';
import { WeatherWidget } from '@/components/WeatherWidget';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TouristApp = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [safetyScore, setSafetyScore] = useState(87);
  const [currentLocation, setCurrentLocation] = useState('Getting location...');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isTracking, setIsTracking] = useState(true);
  const [language, setLanguage] = useState('English');
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [panicHoldTimer, setPanicHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const [panicProgress, setPanicProgress] = useState(0);
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Emergency contacts state
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: 'Tourist Police', number: '1363', type: 'Primary' },
    { name: 'Emergency Services', number: '112', type: 'Emergency' },
    { name: 'Local Police', number: '100', type: 'Local' },
  ]);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' }
  ];

  const nearbyAlerts = [
    { id: 1, type: 'warning', message: 'High crowd density area - stay alert', location: '500m away' },
    { id: 2, type: 'info', message: 'Tourist information center available', location: '200m away' },
  ];

  // Send location to backend
  const sendLocationToBackend = async (longitude: number, latitude: number, address: string, accuracy?: number) => {
    try {
      await apiClient.post('/api/tourists/me/location', {
        coordinates: [longitude, latitude],
        address: address,
        accuracy: accuracy || 0
      });
      console.log('Location sent to backend successfully');
    } catch (error) {
      console.error('Failed to send location to backend:', error);
      // Don't show error to user - this is background sync
    }
  };

  // Request location permission on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      // Request permission immediately
      navigator.geolocation.getCurrentPosition(
        () => {
          console.log('Location permission granted');
          setLocationError(null);
        },
        (error) => {
          console.error('Location permission denied:', error);
          setLocationError(error.message);
          setCurrentLocation('Location access denied - Click "Enable Tracking" to allow');
          setIsTracking(false);
        }
      );
    } else {
      setLocationError('Geolocation not supported');
      setCurrentLocation('GPS not available on this device');
      setIsTracking(false);
    }
  }, []);

  // Get user's real location
  useEffect(() => {
    if (!isTracking) {
      setCurrentLocation('Tracking disabled - Click "Enable Tracking" to start');
      return;
    }

    if (!('geolocation' in navigator)) {
      setCurrentLocation('GPS not available on this device');
      setIsTracking(false);
      return;
    }

    console.log('Starting location tracking...');
    setCurrentLocation('Getting your location...');

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log('Location received:', position.coords);
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        setLocationError(null);
        
        // Reverse geocode to get address
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(res => res.json())
          .then(data => {
            const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setCurrentLocation(address);
            console.log('Address:', address);
            
            // Send location to backend
            sendLocationToBackend(longitude, latitude, address, position.coords.accuracy);
          })
          .catch((err) => {
            console.error('Geocoding error:', err);
            const fallbackAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            setCurrentLocation(fallbackAddress);
            
            // Still send location even if geocoding fails
            sendLocationToBackend(longitude, latitude, fallbackAddress, position.coords.accuracy);
          });
      },
      (error) => {
        console.error('Location error:', error);
        setLocationError(error.message);
        
        let errorMessage = 'Location unavailable';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied - Please allow location access in browser settings';
            setIsTracking(false);
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable - Check GPS settings';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out - Retrying...';
            break;
        }
        
        setCurrentLocation(errorMessage);
        
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => {
      console.log('Stopping location tracking');
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking, toast]);

  // Handle panic button press and hold
  const handlePanicStart = () => {
    setIsPanicActive(true);
    setPanicProgress(0);
    
    let progress = 0;
    const timer = setInterval(() => {
      progress += 10;
      setPanicProgress(progress);
      
      if (progress >= 100) {
        clearInterval(timer);
        triggerSOS();
      }
    }, 300); // 3 seconds total (10 steps * 300ms)
    
    setPanicHoldTimer(timer);
  };

  const handlePanicEnd = () => {
    if (panicHoldTimer) {
      clearInterval(panicHoldTimer);
      setPanicHoldTimer(null);
    }
    setIsPanicActive(false);
    setPanicProgress(0);
  };

  const triggerSOS = async () => {
    setIsPanicActive(false);
    setPanicProgress(0);
    
    // Send SOS alert to backend
    try {
      await apiClient.post('/api/tourists/me/emergency', {
        type: 'panic',
        description: `Emergency SOS triggered at ${currentLocation}. Coordinates: ${coordinates?.lat}, ${coordinates?.lng}`
      });
      
      console.log('🚨 SOS SENT TO BACKEND');
      
      toast({
        title: "🚨 SOS ALERT SENT!",
        description: `Emergency services notified. Your location: ${currentLocation}`,
        variant: "destructive",
        duration: 10000
      });
    } catch (error) {
      console.error('Failed to send SOS to backend:', error);
      
      toast({
        title: "⚠️ SOS Alert",
        description: "Alert sent locally. Please call emergency services directly.",
        variant: "destructive",
        duration: 10000
      });
    }

    // Play alert sound (if available)
    try {
      const audio = new Audio('/alert.mp3');
      audio.play().catch(() => console.log('Audio not available'));
    } catch (e) {
      console.log('Audio not available');
    }

    // Vibrate if available
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  // Handle emergency call
  const handleEmergencyCall = (number: string, name: string) => {
    toast({
      title: `Calling ${name}`,
      description: `Dialing ${number}...`,
    });
    
    // On mobile, this will trigger the phone dialer
    window.location.href = `tel:${number}`;
  };

  // Handle tracking toggle
  const handleTrackingToggle = () => {
    const newState = !isTracking;
    
    if (newState) {
      // Enabling tracking - request permission
      if ('geolocation' in navigator) {
        setCurrentLocation('Requesting location access...');
        navigator.geolocation.getCurrentPosition(
          () => {
            setIsTracking(true);
            setLocationError(null);
            toast({
              title: "Tracking Enabled",
              description: "Your location is now being tracked for safety",
            });
          },
          (error) => {
            console.error('Permission denied:', error);
            setIsTracking(false);
            setCurrentLocation('Location access denied - Check browser settings');
            toast({
              title: "Location Access Required",
              description: "Please allow location access in your browser settings to enable tracking",
              variant: "destructive"
            });
          }
        );
      } else {
        toast({
          title: "GPS Not Available",
          description: "Your device doesn't support location tracking",
          variant: "destructive"
        });
      }
    } else {
      // Disabling tracking
      setIsTracking(false);
      setCurrentLocation('Tracking disabled');
      toast({
        title: "Tracking Disabled",
        description: "Location tracking has been disabled",
        variant: "destructive"
      });
    }
  };

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setShowLanguageDialog(false);
    
    toast({
      title: "Language Changed",
      description: `App language set to ${newLanguage}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto p-4 space-y-6 pb-20">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-foreground">Tourist Safety App</h1>
          <p className="text-muted-foreground">Stay safe, stay connected</p>
        </div>

        {/* Safety Score */}
        <Card className="shadow-card-custom border-card-border bg-gradient-safety text-safety-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Current Safety Score</h3>
                <p className="text-3xl font-bold">{safetyScore}%</p>
                <p className="text-sm opacity-90">You're in a safe zone</p>
              </div>
              <Shield className="w-16 h-16 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Panic Button */}
        <Card className="shadow-emergency border-emergency/20">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Emergency Assistance</h3>
              <div className="relative">
                <Button 
                  variant="emergency" 
                  size="lg" 
                  className="w-full h-20 text-xl font-bold relative overflow-hidden"
                  onMouseDown={handlePanicStart}
                  onMouseUp={handlePanicEnd}
                  onMouseLeave={handlePanicEnd}
                  onTouchStart={handlePanicStart}
                  onTouchEnd={handlePanicEnd}
                >
                  <div 
                    className="absolute inset-0 bg-white/20 transition-all duration-300"
                    style={{ width: `${panicProgress}%` }}
                  />
                  <div className="relative z-10 flex items-center gap-3">
                    <AlertCircle className="w-8 h-8" />
                    {isPanicActive ? 'HOLD TO SEND SOS...' : 'PANIC BUTTON - SEND SOS'}
                  </div>
                </Button>
                {isPanicActive && (
                  <div className="mt-2 text-sm text-destructive font-semibold animate-pulse">
                    Hold for {Math.ceil((100 - panicProgress) / 33)} more seconds...
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Press and hold for 3 seconds to send emergency alert with your location
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-card-custom">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Current Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-sm">{currentLocation}</p>
              {coordinates && (
                <p className="text-xs text-muted-foreground mt-1">
                  {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                </p>
              )}
              {!isTracking && (
                <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-md space-y-2">
                  <p className="text-xs font-semibold text-warning-foreground">
                    ⚠️ Location Tracking is OFF
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click "Enable Tracking" button below, then:
                  </p>
                  <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                    <li>Tap 🔒 lock icon in address bar</li>
                    <li>Tap "Permissions" or "Site settings"</li>
                    <li>Change Location to "Allow"</li>
                    <li>Refresh page</li>
                  </ul>
                  <p className="text-xs font-semibold text-warning-foreground mt-2">
                    OR use Incognito/Private mode to reset permissions
                  </p>
                </div>
              )}
              {locationError && isTracking && (
                <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-xs text-destructive-foreground">
                    ❌ {locationError}
                  </p>
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                {isTracking ? 'Updating in real-time' : 'Last updated: N/A'}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-safety animate-pulse' : 'bg-warning'}`}></div>
                <span className="text-sm">
                  Tracking {isTracking ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-custom">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-primary" />
                <span>Language</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => setShowLanguageDialog(true)}
                >
                  {language}
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Voice Commands Available
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-primary" />
              <span>Emergency Contacts</span>
            </CardTitle>
            <CardDescription>
              Quick access to important numbers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.type}</p>
                  </div>
                  <Button 
                    variant="government" 
                    size="sm"
                    onClick={() => handleEmergencyCall(contact.number, contact.name)}
                  >
                    Call {contact.number}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Nearby Alerts */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-warning" />
              <span>Nearby Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nearbyAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'warning' ? 'bg-warning/10 border-warning' : 'bg-primary/10 border-primary'
                  }`}
                >
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm text-muted-foreground">{alert.location}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weather Widget */}
        <WeatherWidget 
          lat={coordinates?.lat} 
          lon={coordinates?.lng} 
          showSafety={true}
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            size="lg" 
            className="h-16"
            onClick={() => setShowSettingsDialog(true)}
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Button>
          <Button 
            variant={isTracking ? "safety" : "warning"} 
            size="lg" 
            className="h-16"
            onClick={handleTrackingToggle}
          >
            <MapPin className="w-5 h-5 mr-2" />
            {isTracking ? 'Tracking On' : 'Enable Tracking'}
          </Button>
        </div>

        {/* Health Status */}
        <Card className="shadow-card-custom border-safety/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="w-6 h-6 text-safety" />
                <div>
                  <p className="font-medium">Health Status</p>
                  <p className="text-sm text-muted-foreground">All vitals normal</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Last Check</p>
                <p className="font-medium">5 min ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Selection Dialog */}
      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Language</DialogTitle>
            <DialogDescription>
              Choose your preferred language for the app
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={language === lang.name ? "default" : "outline"}
                className="w-full justify-between"
                onClick={() => handleLanguageChange(lang.name)}
              >
                {lang.name}
                {language === lang.name && <Check className="w-4 h-4" />}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Configure your safety preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tracking Frequency</Label>
              <Select defaultValue="high">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High (Every 30 seconds)</SelectItem>
                  <SelectItem value="medium">Medium (Every 2 minutes)</SelectItem>
                  <SelectItem value="low">Low (Every 5 minutes)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Emergency Contact Name</Label>
              <Input placeholder="Enter contact name" />
            </div>
            
            <div>
              <Label>Emergency Contact Number</Label>
              <Input placeholder="+91 XXXXXXXXXX" type="tel" />
            </div>

            <Button className="w-full" onClick={() => {
              toast({
                title: "Settings Saved",
                description: "Your preferences have been updated"
              });
              setShowSettingsDialog(false);
            }}>
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TouristApp;