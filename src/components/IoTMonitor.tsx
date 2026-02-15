import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  Wifi, 
  Battery, 
  Signal, 
  Heart, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Eye,
  Download
} from 'lucide-react';
import apiClient from '@/utils/apiClient';

interface Device {
  id: string;
  name: string;
  type: 'Smart Band' | 'GPS Tracker' | 'Health Monitor' | 'Emergency Button';
  status: 'online' | 'offline' | 'low-battery' | 'error';
  battery: number;
  signal: number;
  lastSeen: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  healthData?: {
    heartRate: number;
    temperature: number;
    steps: number;
  };
  tourist: {
    id: string;
    name: string;
    nationality: string;
  };
}

const IoTMonitor: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'low-battery'>('all');

  // Fetch real devices from API
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await apiClient.get('/api/devices?limit=100');
      if (response.data.success) {
        const apiDevices = response.data.data.map((device: any) => ({
          id: device._id,
          name: device.deviceId || `Device ${device._id.slice(-4)}`,
          type: mapDeviceType(device.deviceType),
          status: mapDeviceStatus(device.status),
          battery: device.battery?.level || 0,
          signal: device.connectivity?.signalStrength || 0,
          lastSeen: device.lastUpdate || device.updatedAt,
          location: {
            lat: device.location?.coordinates?.coordinates?.[1] || 0,
            lng: device.location?.coordinates?.coordinates?.[0] || 0,
            address: device.location?.address || 'Unknown location'
          },
          healthData: device.vitals ? {
            heartRate: device.vitals.heartRate || 0,
            temperature: device.vitals.temperature || 0,
            steps: device.vitals.steps || 0
          } : undefined,
          tourist: {
            id: device.touristId?._id || 'unknown',
            name: device.touristId ? `${device.touristId.personalInfo?.firstName || ''} ${device.touristId.personalInfo?.lastName || ''}`.trim() || 'Unknown Tourist' : 'Unassigned',
            nationality: device.touristId?.personalInfo?.nationality || 'Unknown'
          }
        }));
        setDevices(apiDevices);
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
      // Keep existing devices or show empty state
    }
  };

  const mapDeviceType = (type: string): Device['type'] => {
    const typeMap: Record<string, Device['type']> = {
      'smartband': 'Smart Band',
      'tracker': 'GPS Tracker',
      'phone': 'Health Monitor',
      'watch': 'Smart Band',
      'beacon': 'Emergency Button'
    };
    return typeMap[type] || 'GPS Tracker';
  };

  const mapDeviceStatus = (status: string): Device['status'] => {
    const statusMap: Record<string, Device['status']> = {
      'active': 'online',
      'inactive': 'offline',
      'warning': 'low-battery',
      'offline': 'offline',
      'error': 'error'
    };
    return statusMap[status] || 'offline';
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDevices();
    setIsRefreshing(false);
  };

  const filteredDevices = devices.filter(device => {
    if (filter === 'all') return true;
    return device.status === filter;
  });

  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'online': return 'text-green-500 bg-green-100';
      case 'offline': return 'text-red-500 bg-red-100';
      case 'low-battery': return 'text-yellow-500 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Device['status']) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'offline': return <XCircle className="w-4 h-4" />;
      case 'low-battery': return <Battery className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'Smart Band': return <Smartphone className="w-5 h-5" />;
      case 'GPS Tracker': return <MapPin className="w-5 h-5" />;
      case 'Health Monitor': return <Heart className="w-5 h-5" />;
      case 'Emergency Button': return <AlertTriangle className="w-5 h-5" />;
      default: return <Smartphone className="w-5 h-5" />;
    }
  };

  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    lowBattery: devices.filter(d => d.status === 'low-battery').length,
    error: devices.filter(d => d.status === 'error').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">IoT Device Monitor</h2>
          <p className="text-muted-foreground">Real-time monitoring of tourist safety devices</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Devices</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Online</p>
                <p className="text-2xl font-bold text-green-600">{stats.online}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-red-600">{stats.offline}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Battery</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowBattery}</p>
              </div>
              <Battery className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-red-600">{stats.error}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'online', 'offline', 'low-battery'] as const).map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(filterType)}
            className="capitalize"
          >
            {filterType === 'all' ? 'All Devices' : filterType.replace('-', ' ')}
          </Button>
        ))}
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device) => (
          <Card 
            key={device.id} 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedDevice(device)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getDeviceIcon(device.type)}
                  <CardTitle className="text-lg">{device.name}</CardTitle>
                </div>
                <Badge className={`${getStatusColor(device.status)} border-0`}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(device.status)}
                    <span className="capitalize">{device.status.replace('-', ' ')}</span>
                  </div>
                </Badge>
              </div>
              <CardDescription>{device.type}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Tourist Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{device.tourist.name}</p>
                  <p className="text-sm text-muted-foreground">{device.tourist.nationality}</p>
                </div>
                <Badge variant="outline">{device.tourist.nationality}</Badge>
              </div>

              {/* Battery & Signal */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Battery</span>
                  <span className="text-sm font-medium">{device.battery}%</span>
                </div>
                <Progress value={device.battery} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Signal</span>
                  <span className="text-sm font-medium">{device.signal}%</span>
                </div>
                <Progress value={device.signal} className="h-2" />
              </div>

              {/* Health Data */}
              {device.healthData && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <Heart className="w-4 h-4 mx-auto text-red-500 mb-1" />
                    <p className="text-xs text-muted-foreground">Heart Rate</p>
                    <p className="text-sm font-medium">{device.healthData.heartRate} bpm</p>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 mx-auto bg-blue-500 rounded mb-1"></div>
                    <p className="text-xs text-muted-foreground">Temp</p>
                    <p className="text-sm font-medium">{device.healthData.temperature}°C</p>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 mx-auto bg-green-500 rounded mb-1"></div>
                    <p className="text-xs text-muted-foreground">Steps</p>
                    <p className="text-sm font-medium">{device.healthData.steps.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {/* Last Seen */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Last seen: {new Date(device.lastSeen).toLocaleTimeString()}</span>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Device Detail Modal would go here */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Device Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDevice(null)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Device Name</p>
                    <p className="font-medium">{selectedDevice.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{selectedDevice.type}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedDevice.location.address}</p>
                </div>

                {selectedDevice.healthData && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Health Data</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <Heart className="w-6 h-6 mx-auto text-red-500 mb-2" />
                        <p className="text-sm text-muted-foreground">Heart Rate</p>
                        <p className="text-lg font-bold">{selectedDevice.healthData.heartRate} bpm</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 mx-auto bg-blue-500 rounded mb-2"></div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="text-lg font-bold">{selectedDevice.healthData.temperature}°C</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="w-6 h-6 mx-auto bg-green-500 rounded mb-2"></div>
                        <p className="text-sm text-muted-foreground">Steps</p>
                        <p className="text-lg font-bold">{selectedDevice.healthData.steps.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default IoTMonitor;
