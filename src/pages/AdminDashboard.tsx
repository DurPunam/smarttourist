import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Users,
  MapPin,
  AlertTriangle,
  Activity,
  Search,
  Eye,
  FileText,
  Zap,
  Clock,
  RefreshCw,
  Download
} from 'lucide-react';
import apiClient from '@/utils/apiClient';
import { useToast } from '@/hooks/use-toast';

interface Tourist {
  id: string;
  name: string;
  nationality: string;
  safetyScore: number;
  lastLocation: string;
  status: 'safe' | 'warning' | 'alert';
  lastSeen: string;
  alerts: number;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [realtimeAlerts, setRealtimeAlerts] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState([
    { label: 'Total Active Tourists', value: '0', change: 'Loading...', icon: Users, color: 'text-primary' },
    { label: 'High Risk Zones', value: '0', change: 'Loading...', icon: MapPin, color: 'text-warning' },
    { label: 'Emergency Alerts', value: '0', change: 'Loading...', icon: AlertTriangle, color: 'text-emergency' },
    { label: 'IoT Devices Online', value: '0', change: 'Loading...', icon: Activity, color: 'text-safety' },
  ]);

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      // Fetch tourists
      const touristsResponse = await apiClient.get('/tourists?limit=100');
      if (touristsResponse.data.success) {
        const apiTourists = touristsResponse.data.data.map((tourist: any) => ({
          id: tourist.touristId || tourist._id,
          name: `${tourist.personalInfo?.firstName || ''} ${tourist.personalInfo?.lastName || ''}`.trim() || 'Unknown',
          nationality: tourist.personalInfo?.nationality || 'Unknown',
          safetyScore: tourist.safetyScore || 0,
          lastLocation: tourist.location?.current?.address || 'Unknown location',
          status: tourist.status,
          lastSeen: tourist.location?.lastUpdate ? new Date(tourist.location.lastUpdate).toLocaleString() : 'Unknown',
          alerts: tourist.statistics?.alertsTriggered || 0
        }));
        setTourists(apiTourists);
      }

      // Fetch alerts
      const alertsResponse = await apiClient.get('/alerts?limit=10');
      if (alertsResponse.data.success) {
        const apiAlerts = alertsResponse.data.data.map((alert: any) => ({
          id: alert._id || alert.id,
          type: alert.type,
          message: `${alert.title} - ${alert.description}`,
          time: new Date(alert.createdAt).toLocaleString(),
          severity: alert.severity === 'critical' ? 'high' : alert.severity === 'high' ? 'medium' : 'low'
        }));
        setRealtimeAlerts(apiAlerts);
      }

      // Fetch devices
      const devicesResponse = await apiClient.get('/devices?limit=100');
      
      // Calculate statistics from fetched data
      const totalTourists = touristsResponse.data.pagination?.total || 0;
      const activeTourists = touristsResponse.data.data.filter((t: any) => t.status === 'active').length;
      const highRiskTourists = touristsResponse.data.data.filter((t: any) => t.riskLevel === 'high').length;
      const criticalAlerts = alertsResponse.data.data.filter((a: any) => a.severity === 'critical').length;
      const activeDevices = devicesResponse.data.success ? 
        devicesResponse.data.data.filter((d: any) => d.status === 'active').length : 0;
      const totalDevices = devicesResponse.data.success ? 
        devicesResponse.data.pagination?.total || devicesResponse.data.data.length : 0;
      
      setStats([
        { 
          label: 'Total Active Tourists', 
          value: totalTourists.toString(), 
          change: `${activeTourists} active today`, 
          icon: Users, 
          color: 'text-primary' 
        },
        { 
          label: 'High Risk Zones', 
          value: highRiskTourists.toString(), 
          change: `${criticalAlerts} critical alerts`, 
          icon: MapPin, 
          color: 'text-warning' 
        },
        { 
          label: 'Emergency Alerts', 
          value: alertsResponse.data.pagination?.total?.toString() || '0', 
          change: 'Last 24 hours', 
          icon: AlertTriangle, 
          color: 'text-emergency' 
        },
        { 
          label: 'IoT Devices Online', 
          value: activeDevices.toString(), 
          change: `${totalDevices} total devices`, 
          icon: Activity, 
          color: 'text-safety' 
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      if (!silent) {
        toast({
          title: 'Error',
          description: 'Failed to fetch dashboard data',
          variant: 'destructive',
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    toast({
      title: 'Refreshing',
      description: 'Fetching latest data...',
    });
  };

  const handleExportReport = () => {
    try {
      const reportData = {
        generatedAt: new Date().toISOString(),
        statistics: stats,
        tourists: filteredTourists,
        alerts: realtimeAlerts,
      };
      
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admin-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'Report exported successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export report',
        variant: 'destructive',
      });
    }
  };

  const filteredTourists = tourists.filter(tourist => {
    const matchesSearch = tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || tourist.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-safety bg-safety/10 border-safety/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'alert': return 'text-emergency bg-emergency/10 border-emergency/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-xl text-muted-foreground">Monitor and manage tourist safety</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="government" 
              onClick={handleExportReport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-card-custom border-card-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Real-time Alerts */}
        <Card className="shadow-government border-warning/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-warning" />
              <span>Real-time Anomaly Alerts</span>
            </CardTitle>
            <CardDescription>
              Live monitoring of tourist safety anomalies and geo-fencing violations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {realtimeAlerts.length > 0 ? (
                realtimeAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'high' ? 'bg-emergency/10 border-emergency' :
                      alert.severity === 'medium' ? 'bg-warning/10 border-warning' :
                      'bg-primary/10 border-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{alert.time}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No active alerts at the moment</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tourist Monitoring */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-primary" />
              <span>Tourist Monitoring</span>
            </CardTitle>
            <CardDescription>
              Real-time tracking of all registered tourists
            </CardDescription>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={selectedFilter === 'all' ? 'government' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={selectedFilter === 'safe' ? 'safety' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedFilter('safe')}
                >
                  Safe
                </Button>
                <Button 
                  variant={selectedFilter === 'warning' ? 'warning' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedFilter('warning')}
                >
                  Warning
                </Button>
                <Button 
                  variant={selectedFilter === 'alert' ? 'emergency' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedFilter('alert')}
                >
                  Alert
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTourists.length > 0 ? (
                filteredTourists.map((tourist) => (
                  <div 
                    key={tourist.id}
                    className="p-4 border rounded-lg hover:shadow-card-custom transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tourist.status)}`}>
                          {tourist.status.toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{tourist.name}</h4>
                          <p className="text-sm text-muted-foreground">ID: {tourist.id}</p>
                          <p className="text-sm text-muted-foreground">Nationality: {tourist.nationality}</p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Safety Score:</span>
                          <span className={`font-bold ${
                            tourist.safetyScore >= 70 ? 'text-safety' :
                            tourist.safetyScore >= 40 ? 'text-warning' : 'text-emergency'
                          }`}>
                            {tourist.safetyScore}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Last seen: {tourist.lastSeen}</p>
                        {tourist.alerts > 0 && (
                          <p className="text-sm text-emergency font-medium">
                            {tourist.alerts} active alerts
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm">{tourist.lastLocation}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          Track
                        </Button>
                        <Button variant="government" size="sm">
                          <FileText className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No tourists found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Heatmap Placeholder */}
        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-primary" />
              <span>Tourist Density Heatmap</span>
            </CardTitle>
            <CardDescription>
              Visual representation of tourist clusters and high-risk zones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-secondary rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Interactive heatmap would be displayed here</p>
                <p className="text-sm text-muted-foreground">Shows real-time tourist locations and risk zones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
