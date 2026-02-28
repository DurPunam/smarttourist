import { useState, useEffect } from 'react';
import { MapView } from '@/components/MapView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Users, 
  AlertTriangle, 
  Shield, 
  Navigation,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContextImproved';
import apiClient from '@/utils/apiClient';

interface Location {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: 'tourist' | 'police' | 'hospital' | 'safe-zone' | 'alert';
  status?: 'active' | 'inactive' | 'emergency';
}

export default function MapTracking() {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showGeofencing, setShowGeofencing] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch real tourist locations from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/api/tourists?limit=100');
        
        if (response.data.success) {
          const touristLocations: Location[] = response.data.data
            .filter((tourist: any) => tourist.location?.current?.coordinates?.coordinates)
            .map((tourist: any) => ({
              id: tourist._id,
              lat: tourist.location.current.coordinates.coordinates[1],
              lng: tourist.location.current.coordinates.coordinates[0],
              name: `${tourist.personalInfo?.firstName || ''} ${tourist.personalInfo?.lastName || ''}`.trim() || 'Tourist',
              type: 'tourist' as const,
              status: tourist.status as 'active' | 'inactive' | 'emergency'
            }));
          
          setLocations(touristLocations);
        }
      } catch (error) {
        console.error('Failed to fetch tourist locations:', error);
        // Keep empty array - nearby places will still show from MapView
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const filteredLocations = filterType === 'all' 
    ? locations 
    : locations.filter(loc => loc.type === filterType);

  const stats = {
    total: locations.length,
    tourists: locations.filter(l => l.type === 'tourist').length,
    police: locations.filter(l => l.type === 'police').length,
    alerts: locations.filter(l => l.type === 'alert').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Real-Time Map Tracking
            </h1>
            <p className="text-muted-foreground">
              Monitor tourist locations, emergency alerts, and safety zones in real-time
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHeatmap(!showHeatmap)}
            >
              {showHeatmap ? 'Hide' : 'Show'} Heatmap
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGeofencing(!showGeofencing)}
            >
              {showGeofencing ? 'Hide' : 'Show'} Geofencing
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Locations</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <MapPin className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Tourists</p>
                  <p className="text-2xl font-bold">{stats.tourists}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Police Stations</p>
                  <p className="text-2xl font-bold">{stats.police}</p>
                </div>
                <Shield className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold">{stats.alerts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground mr-2">Filter:</span>
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            All
          </Button>
          <Button
            variant={filterType === 'tourist' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('tourist')}
          >
            Tourists
          </Button>
          <Button
            variant={filterType === 'police' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('police')}
          >
            Police
          </Button>
          <Button
            variant={filterType === 'hospital' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('hospital')}
          >
            Hospitals
          </Button>
          <Button
            variant={filterType === 'alert' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('alert')}
          >
            Alerts
          </Button>
        </div>

        {/* Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <Card className="lg:col-span-3">
            <CardContent className="p-0">
              <div className="h-[600px] rounded-lg overflow-hidden">
                <MapView
                  zoom={12}
                  locations={filteredLocations}
                  showHeatmap={showHeatmap}
                  showGeofencing={showGeofencing}
                  onLocationClick={handleLocationClick}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Details Sidebar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLocation ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{selectedLocation.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <Badge variant="outline" className="capitalize">
                      {selectedLocation.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge 
                      variant={
                        selectedLocation.status === 'emergency' 
                          ? 'destructive' 
                          : 'default'
                      }
                      className="capitalize"
                    >
                      {selectedLocation.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Coordinates</p>
                    <p className="text-sm font-mono">
                      {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </p>
                  </div>
                  <div className="pt-4 space-y-2">
                    <Button className="w-full" size="sm">
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                    {selectedLocation.type === 'alert' && (
                      <Button variant="destructive" className="w-full" size="sm">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Respond to Alert
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Click on a marker to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Location Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {locations.slice(0, 5).map((location) => (
                <div 
                  key={location.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      location.status === 'emergency' ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                    }`} />
                    <div>
                      <p className="font-medium">{location.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{location.type}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {location.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
