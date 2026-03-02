import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import apiClient from '@/utils/apiClient';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Location {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: 'tourist' | 'police' | 'hospital' | 'safe-zone' | 'alert';
  status?: 'active' | 'inactive' | 'emergency';
}

interface NearbyPlace {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'hotel' | 'restaurant' | 'attraction';
  lat: number;
  lng: number;
  distance?: string;
  address?: string;
}

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  locations?: Location[];
  showHeatmap?: boolean;
  showGeofencing?: boolean;
  onLocationClick?: (location: Location) => void;
}

export function MapView({
  center = [28.6139, 77.209], // Default: New Delhi
  zoom = 13,
  locations = [],
  showHeatmap: initialShowHeatmap = false,
  showGeofencing: initialShowGeofencing = false,
  onLocationClick,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [realTimeLocations, setRealTimeLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(initialShowHeatmap);
  const [showGeofencing, setShowGeofencing] = useState(initialShowGeofencing);
  const heatLayerRef = useRef<any>(null);
  const geofenceLayersRef = useRef<L.Circle[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const nearbyMarkersRef = useRef<L.Marker[]>([]);

  // Predefined nearby places - will be replaced with dynamic data
  const [fetchingNearby, setFetchingNearby] = useState(false);

  // Fetch nearby places from OpenStreetMap based on user location
  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    setFetchingNearby(true);
    try {
      const radius = 5000; // 5km radius
      
      // Overpass API query for nearby places
      const queries = [
        // Police stations
        `node["amenity"="police"](around:${radius},${lat},${lng});`,
        // Hospitals
        `node["amenity"="hospital"](around:${radius},${lat},${lng});`,
        `node["amenity"="clinic"](around:${radius},${lat},${lng});`,
        // Hotels
        `node["tourism"="hotel"](around:${radius},${lat},${lng});`,
        // Restaurants
        `node["amenity"="restaurant"](around:${radius},${lat},${lng});`,
        // Tourist attractions
        `node["tourism"="attraction"](around:${radius},${lat},${lng});`,
        `node["tourism"="museum"](around:${radius},${lat},${lng});`,
      ];

      const overpassQuery = `
        [out:json][timeout:25];
        (
          ${queries.join('\n')}
        );
        out body;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
      });

      const data = await response.json();
      
      if (data.elements && data.elements.length > 0) {
        const places: NearbyPlace[] = data.elements
          .filter((element: any) => element.tags && element.tags.name)
          .map((element: any) => {
            const distance = calculateDistance(lat, lng, element.lat, element.lon);
            
            let type: NearbyPlace['type'] = 'attraction';
            if (element.tags.amenity === 'police') type = 'police';
            else if (element.tags.amenity === 'hospital' || element.tags.amenity === 'clinic') type = 'hospital';
            else if (element.tags.tourism === 'hotel') type = 'hotel';
            else if (element.tags.amenity === 'restaurant') type = 'restaurant';
            else if (element.tags.tourism === 'attraction' || element.tags.tourism === 'museum') type = 'attraction';

            return {
              id: element.id.toString(),
              name: element.tags.name,
              type,
              lat: element.lat,
              lng: element.lon,
              distance: `${distance.toFixed(1)} km`,
              address: element.tags['addr:street'] || element.tags['addr:city'] || 'Address not available'
            };
          })
          .sort((a, b) => parseFloat(a.distance!) - parseFloat(b.distance!))
          .slice(0, 20); // Top 20 nearest

        setNearbyPlaces(places);
      } else {
        // Fallback to predefined places if API fails
        console.log('No nearby places found, using fallback data');
        setNearbyPlaces([]);
      }
    } catch (error) {
      console.error('Failed to fetch nearby places:', error);
      // Use empty array on error
      setNearbyPlaces([]);
    } finally {
      setFetchingNearby(false);
    }
  };

  // Fetch real-time tourist locations
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
          
          setRealTimeLocations(touristLocations);
        }
      } catch (error) {
        console.error('Failed to fetch tourist locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch nearby places when user location changes
  useEffect(() => {
    if (userLocation) {
      fetchNearbyPlaces(userLocation[0], userLocation[1]);
    }
  }, [userLocation]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(userPos);

          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `<div style="position: relative; width: 20px; height: 20px;">
              <div style="position: absolute; inset: 0; background: #3B82F6; border-radius: 50%; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></div>
              <div style="position: relative; background: #3B82F6; border-radius: 50%; width: 16px; height: 16px; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
            </div>
            <style>
              @keyframes ping {
                75%, 100% {
                  transform: scale(2);
                  opacity: 0;
                }
              }
            </style>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

          L.marker(userPos, { icon: userIcon })
            .addTo(map)
            .bindPopup('<b>Your Location</b>');

          map.setView(userPos, zoom);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Only show provided locations (filtered), not real-time locations when filtering
    const displayLocations = locations.length > 0 ? locations : realTimeLocations;

    displayLocations.forEach((location) => {
      const icon = getMarkerIcon(location.type, location.status);
      const marker = L.marker([location.lat, location.lng], { icon })
        .addTo(mapRef.current!)
        .bindPopup(
          `<div style="padding: 8px;">
            <h3 style="font-weight: 600; margin-bottom: 4px;">${location.name}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px; text-transform: uppercase;">${location.type}</p>
            ${location.status ? `<span style="font-size: 11px; padding: 2px 8px; border-radius: 12px; background: ${getStatusBgColor(location.status)}; color: ${getStatusTextColor(location.status)};">${location.status}</span>` : ''}
          </div>`
        );

      marker.on('click', () => {
        if (onLocationClick) {
          onLocationClick(location);
        }
      });

      markersRef.current.push(marker);
    });
  }, [locations, realTimeLocations]);

  // Update nearby places markers - only show if no filtered locations
  useEffect(() => {
    if (!mapRef.current) return;

    nearbyMarkersRef.current.forEach((marker) => marker.remove());
    nearbyMarkersRef.current = [];

    // Only show nearby places if we're not filtering specific location types
    // This prevents confusion between filtered markers and nearby places
    if (locations.length === 0 && nearbyPlaces.length > 0) {
      nearbyPlaces.forEach((place) => {
        const icon = getNearbyPlaceIcon(place.type);
        const marker = L.marker([place.lat, place.lng], { icon })
          .addTo(mapRef.current!)
          .bindPopup(
            `<div style="padding: 8px; min-width: 150px;">
              <h3 style="font-weight: 600; margin-bottom: 4px;">${place.name}</h3>
              <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${place.type.toUpperCase()}</p>
              ${place.address ? `<p style="font-size: 11px; color: #888; margin-bottom: 4px;">${place.address}</p>` : ''}
              ${place.distance ? `<p style="font-size: 11px; color: #3B82F6; font-weight: 600;">📍 ${place.distance} away</p>` : ''}
            </div>`
          );

        nearbyMarkersRef.current.push(marker);
      });
    }
  }, [nearbyPlaces, locations]);

  // Heatmap toggle
  useEffect(() => {
    if (!mapRef.current) return;

    if (showHeatmap) {
      addHeatmap();
    } else {
      removeHeatmap();
    }
  }, [showHeatmap, realTimeLocations]);

  // Geofencing toggle
  useEffect(() => {
    if (!mapRef.current) return;

    if (showGeofencing) {
      addGeofencing();
    } else {
      removeGeofencing();
    }
  }, [showGeofencing, userLocation]);

  const addHeatmap = () => {
    if (!mapRef.current || heatLayerRef.current) return;

    const displayLocations = locations.length > 0 ? locations : realTimeLocations;
    if (displayLocations.length === 0) return;

    const heatPoints = displayLocations.map(loc => {
      const circle = L.circle([loc.lat, loc.lng], {
        color: loc.status === 'emergency' ? '#EF4444' : '#F59E0B',
        fillColor: loc.status === 'emergency' ? '#EF4444' : '#F59E0B',
        fillOpacity: 0.3,
        radius: 200,
        weight: 0
      }).addTo(mapRef.current!);
      
      return circle;
    });

    heatLayerRef.current = heatPoints;
  };

  const removeHeatmap = () => {
    if (heatLayerRef.current) {
      heatLayerRef.current.forEach((circle: L.Circle) => circle.remove());
      heatLayerRef.current = null;
    }
  };

  const addGeofencing = () => {
    if (!mapRef.current || !userLocation) return;

    removeGeofencing();

    const safeZone = L.circle(userLocation, {
      color: '#10B981',
      fillColor: '#10B981',
      fillOpacity: 0.1,
      radius: 500,
      weight: 2,
      dashArray: '5, 10'
    }).addTo(mapRef.current);
    safeZone.bindPopup('<b>Safe Zone</b><br>500m radius');

    const warningZone = L.circle(userLocation, {
      color: '#F59E0B',
      fillColor: '#F59E0B',
      fillOpacity: 0.05,
      radius: 1000,
      weight: 2,
      dashArray: '5, 10'
    }).addTo(mapRef.current);
    warningZone.bindPopup('<b>Warning Zone</b><br>1km radius');

    const restrictedAreas = [
      { lat: 28.6500, lng: 77.2500, name: 'High Risk Area 1' },
      { lat: 28.5800, lng: 77.1900, name: 'High Risk Area 2' },
    ];

    restrictedAreas.forEach(area => {
      const restrictedZone = L.circle([area.lat, area.lng], {
        color: '#EF4444',
        fillColor: '#EF4444',
        fillOpacity: 0.2,
        radius: 300,
        weight: 2
      }).addTo(mapRef.current!);
      restrictedZone.bindPopup(`<b>⚠️ ${area.name}</b><br>Restricted Area`);
      geofenceLayersRef.current.push(restrictedZone);
    });

    geofenceLayersRef.current.push(safeZone, warningZone);
  };

  const removeGeofencing = () => {
    geofenceLayersRef.current.forEach((layer) => layer.remove());
    geofenceLayersRef.current = [];
  };

  const getMarkerIcon = (type: string, status?: string) => {
    const colors: Record<string, string> = {
      tourist: '#3B82F6',
      police: '#6366F1',
      hospital: '#EF4444',
      'safe-zone': '#10B981',
      alert: '#F59E0B',
    };

    const color = colors[type] || '#6B7280';
    const isEmergency = status === 'emergency';

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="position: relative; width: 28px; height: 28px;">
        ${isEmergency ? `<div style="position: absolute; inset: 0; background: ${color}; opacity: 0.3; border-radius: 50%; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
        <div style="position: relative; background: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
      </div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  const getNearbyPlaceIcon = (type: string) => {
    const icons: Record<string, string> = {
      police: '👮',
      hospital: '🏥',
      hotel: '🏨',
      restaurant: '🍽️',
      attraction: '🎭',
    };

    const colors: Record<string, string> = {
      police: '#6366F1',
      hospital: '#EF4444',
      hotel: '#8B5CF6',
      restaurant: '#F59E0B',
      attraction: '#10B981',
    };

    return L.divIcon({
      className: 'nearby-place-marker',
      html: `<div style="background: ${colors[type] || '#6B7280'}; padding: 4px 8px; border-radius: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); font-size: 16px;">
        ${icons[type] || '📍'}
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const getStatusBgColor = (status: string) => {
    const colors: Record<string, string> = {
      active: '#D1FAE5',
      inactive: '#F3F4F6',
      emergency: '#FEE2E2',
    };
    return colors[status] || '#F3F4F6';
  };

  const getStatusTextColor = (status: string) => {
    const colors: Record<string, string> = {
      active: '#065F46',
      inactive: '#6B7280',
      emergency: '#991B1B',
    };
    return colors[status] || '#6B7280';
  };

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 15);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        <GlassCard className="p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={centerOnUser}
            title="Center on my location"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </GlassCard>

        {/* Heatmap & Geofencing Controls */}
        <GlassCard className="p-3 space-y-3">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="heatmap" className="text-xs font-medium cursor-pointer">
              Heatmap
            </Label>
            <Switch
              id="heatmap"
              checked={showHeatmap}
              onCheckedChange={setShowHeatmap}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="geofencing" className="text-xs font-medium cursor-pointer">
              Geofencing
            </Label>
            <Switch
              id="geofencing"
              checked={showGeofencing}
              onCheckedChange={setShowGeofencing}
            />
          </div>
        </GlassCard>

        {/* Legend */}
        <GlassCard className="p-3 space-y-2 max-w-[200px]">
          <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
            Legend
          </h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
              <span className="text-gray-700 dark:text-gray-300">Tourists</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white shadow-sm" />
              <span className="text-gray-700 dark:text-gray-300">Police</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm" />
              <span className="text-gray-700 dark:text-gray-300">Hospital</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
              <span className="text-gray-700 dark:text-gray-300">Safe Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm" />
              <span className="text-gray-700 dark:text-gray-300">Alert</span>
            </div>
          </div>
          
          {showGeofencing && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
              <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                Geofencing
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Safe (500m)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-amber-500" />
                  <span className="text-gray-700 dark:text-gray-300">Warning (1km)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 opacity-30" />
                  <span className="text-gray-700 dark:text-gray-300">Restricted</span>
                </div>
              </div>
            </>
          )}
        </GlassCard>
      </div>

      {/* Nearby Places Panel - Only show when no filters active */}
      {nearbyPlaces.length > 0 && locations.length === 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] max-w-sm">
          <GlassCard className="p-4 max-h-[300px] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Nearby Places
              </h4>
              {fetchingNearby && (
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary-500 border-t-transparent" />
              )}
            </div>
            <div className="space-y-2">
              {nearbyPlaces.slice(0, 10).map((place) => (
                <div
                  key={place.id}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  onClick={() => {
                    if (mapRef.current) {
                      mapRef.current.setView([place.lat, place.lng], 16);
                    }
                  }}
                >
                  <div className="text-lg">
                    {place.type === 'police' && '👮'}
                    {place.type === 'hospital' && '🏥'}
                    {place.type === 'hotel' && '🏨'}
                    {place.type === 'restaurant' && '🍽️'}
                    {place.type === 'attraction' && '🎭'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      {place.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {place.distance}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {place.type}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Showing top {Math.min(10, nearbyPlaces.length)} of {nearbyPlaces.length} places
              </p>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Location Info */}
      {userLocation && (
        <div className="absolute bottom-4 right-4 z-[1000]">
          <GlassCard className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary-500" />
              <span className="text-gray-900 dark:text-white font-mono text-xs">
                {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
              </span>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
          <GlassCard className="p-2 px-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent" />
              <span className="text-gray-900 dark:text-white">Loading locations...</span>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
