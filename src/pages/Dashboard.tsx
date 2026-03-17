import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import apiClient from '@/utils/apiClient';
import { 
  Shield, 
  Smartphone, 
  Monitor, 
  Wifi, 
  IdCard,
  Users,
  AlertTriangle,
  MapPin,
  Activity,
  TrendingUp,
  Clock,
  Zap,
  Globe,
  BarChart3,
  CheckCircle,
  Heart,
  Battery,
  Signal,
  Eye,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw,
  XCircle
} from 'lucide-react';
import heroImage from '@/assets/hero-banner.jpg';
import ActivityFeed from '@/components/ActivityFeed';
import StatsChart from '@/components/StatsChart';
import { WeatherWidget } from '@/components/WeatherWidget';
import NotificationPanel from '@/components/NotificationPanel';
import QuickActions from '@/components/QuickActions';
import IoTMonitor from '@/components/IoTMonitor';
import TouristManagement from '@/components/TouristManagement';
import NotificationSystem from '@/components/NotificationSystem';
import { useAuth } from '@/contexts/AuthContextImproved';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'iot' | 'tourists' | 'notifications'>('overview');
  const [systemStatus, setSystemStatus] = useState({
    uptime: '99.9%',
    responseTime: '0ms',
    activeConnections: 0,
    dataProcessed: '0MB',
    safetyScore: 100,
    activeTourists: 0,
    activeDevices: 0,
    criticalAlerts: 0
  });

  const [touristStats, setTouristStats] = useState({
    total: 0,
    active: 0,
    atRisk: 0,
    safe: 0
  });

  const [deviceStats, setDeviceStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    batteryLow: 0
  });

  // Fetch real-time data from API
  useEffect(() => {
    fetchDashboardData();
    fetchSystemMetrics();
    // Refresh dashboard data every 30 seconds
    const dashboardInterval = setInterval(fetchDashboardData, 30000);
    // Refresh metrics every 5 seconds for real-time updates
    const metricsInterval = setInterval(fetchSystemMetrics, 5000);
    
    return () => {
      clearInterval(dashboardInterval);
      clearInterval(metricsInterval);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch tourists
      const touristsResponse = await apiClient.get('/tourists?limit=100');
      if (touristsResponse.data.success) {
        const tourists = touristsResponse.data.data;
        const activeTourists = tourists.filter((t: any) => t.status === 'active').length;
        const atRiskTourists = tourists.filter((t: any) => t.riskLevel === 'high' || t.riskLevel === 'critical').length;
        
        setTouristStats({
          total: touristsResponse.data.pagination?.total || tourists.length,
          active: activeTourists,
          atRisk: atRiskTourists,
          safe: activeTourists - atRiskTourists
        });

        setSystemStatus(prev => ({
          ...prev,
          activeTourists: activeTourists
        }));
      }

      // Fetch alerts
      const alertsResponse = await apiClient.get('/alerts?status=active');
      if (alertsResponse.data.success) {
        const criticalAlerts = alertsResponse.data.data.filter((a: any) => a.severity === 'critical').length;
        setSystemStatus(prev => ({
          ...prev,
          criticalAlerts
        }));
      }

      // Fetch devices
      const devicesResponse = await apiClient.get('/devices/statistics');
      if (devicesResponse.data.success) {
        const deviceData = devicesResponse.data.data;
        const onlineDevices = deviceData.totals?.online || 0;
        const offlineDevices = deviceData.totals?.offline || 0;
        const totalDevices = deviceData.totals?.total || 0;

        setDeviceStats({
          total: totalDevices,
          online: onlineDevices,
          offline: offlineDevices,
          batteryLow: 0
        });

        setSystemStatus(prev => ({
          ...prev,
          activeDevices: onlineDevices
        }));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const fetchSystemMetrics = async () => {
    try {
      const response = await apiClient.get('/metrics/system');
      if (response.data.success) {
        const metrics = response.data.data;
        console.log('Metrics received:', metrics.performance);
        setSystemStatus(prev => ({
          ...prev,
          responseTime: metrics.performance.responseTime,
          activeConnections: metrics.performance.activeConnections,
          dataProcessed: metrics.performance.dataProcessed,
          safetyScore: metrics.performance.safetyScore,
          uptime: metrics.system.uptime.percent
        }));
      }
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
    }
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update response time simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        responseTime: `${Math.floor(Math.random() * 100 + 100)}ms`,
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 10 - 5)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchDashboardData(), fetchSystemMetrics()]);
    setIsRefreshing(false);
  };

  const quickStats = [
    {
      label: 'Active Tourists',
      value: systemStatus.activeTourists.toLocaleString(),
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      trend: 'up' as const,
      change: '+12%'
    },
    {
      label: 'IoT Devices',
      value: systemStatus.activeDevices.toLocaleString(),
      icon: Smartphone,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      trend: 'up' as const,
      change: '+8%'
    },
    {
      label: 'Critical Alerts',
      value: systemStatus.criticalAlerts,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      trend: 'down' as const,
      change: '-3%'
    },
    {
      label: 'System Uptime',
      value: systemStatus.uptime,
      icon: Activity,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      trend: 'up' as const,
      change: '+0.1%'
    }
  ];

  const systemMetrics = [
    { 
      label: 'Response Time', 
      value: systemStatus.responseTime, 
      icon: Zap, 
      color: 'text-green-500',
      description: 'How fast the server responds to requests'
    },
    { 
      label: 'Active Users', 
      value: systemStatus.activeConnections.toLocaleString(), 
      icon: Wifi, 
      color: 'text-blue-500',
      description: 'Number of users online right now'
    },
    { 
      label: 'Data Processed', 
      value: systemStatus.dataProcessed, 
      icon: Globe, 
      color: 'text-purple-500',
      description: 'Total data handled by the system'
    },
    { 
      label: 'Safety Score', 
      value: `${systemStatus.safetyScore}%`, 
      icon: Shield, 
      color: 'text-orange-500',
      description: 'Overall system health (100% = perfect)'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              Tourist Safety Platform Dashboard
            </p>
          </div>
          <Badge variant="secondary" className="gap-2">
            <Clock className="w-3 h-3" />
            {currentTime.toLocaleTimeString()}
          </Badge>
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
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={activeView === 'overview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeView === 'iot' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('iot')}
          >
            IoT Monitor
          </Button>
          <Button
            variant={activeView === 'tourists' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('tourists')}
          >
            Tourists
          </Button>
          <Button
            variant={activeView === 'notifications' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('notifications')}
          >
            Notifications
          </Button>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero shadow-government">
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt="Tourist Safety Platform" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
          </div>
          <div className="relative z-10 p-8 md:p-12">
            <div className="max-w-4xl">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-8 h-8 text-primary-foreground animate-pulse-slow" />
                <span className="text-sm text-primary-foreground/90 font-medium">
                  Government of India • Ministry of Tourism
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-display text-primary-foreground mb-4 animate-slide-up">
                Tourist Safety Platform
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-6 max-w-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Ensuring tourist safety through digital innovation and real-time monitoring.
              </p>
            </div>
            
            {/* Real-time system status */}
            <div className="mt-8 p-4 bg-primary-foreground/10 backdrop-blur-sm rounded-xl border border-primary-foreground/20">
              <div className="flex items-center justify-between text-primary-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-safety rounded-full animate-pulse"></div>
                  <span className="text-sm">System Status: All systems operational</span>
                </div>
                <span className="text-sm font-mono">
                  {currentTime.toLocaleTimeString('en-IN')} IST
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Conditional Content Rendering */}
        {activeView === 'overview' && (
          <>
            {/* Quick Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card 
                    key={index} 
                    className="group shadow-card-custom border-card-border hover:shadow-glow transition-all duration-300 animate-scale-in hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                        <Badge variant={stat.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                          {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold font-display">{stat.value}</p>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={stat.trend === 'up' ? 75 : 25} 
                            className="h-2 flex-1"
                          />
                          <span className="text-xs text-muted-foreground">vs yesterday</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Safety Score Card */}
            <Card className="shadow-government animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-display">
                  <Heart className="w-6 h-6 text-red-500" />
                  <span>Overall Safety Score</span>
                  <Badge variant="outline" className="ml-auto">
                    Real-time
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-4xl font-bold text-foreground">
                        {systemStatus.safetyScore}%
                      </div>
                      <Badge variant={systemStatus.safetyScore >= 90 ? 'default' : systemStatus.safetyScore >= 70 ? 'secondary' : 'destructive'}>
                        {systemStatus.safetyScore >= 90 ? 'Excellent' : systemStatus.safetyScore >= 70 ? 'Good' : 'Needs Attention'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on active tourists, device health, and incident reports
                    </p>
                  </div>
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - systemStatus.safetyScore / 100)}`}
                        className="text-primary transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Performance Metrics */}
            <Card className="shadow-government animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-display">
                  <Activity className="w-6 h-6 text-primary" />
                  <span>System Performance Metrics</span>
                  <div className="ml-auto flex items-center space-x-2">
                    <div className="w-2 h-2 bg-safety rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Live</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {systemMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <div 
                        key={index} 
                        className="relative text-center p-6 bg-gradient-to-br from-secondary/40 to-secondary/20 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 animate-bounce-in group"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        title={metric.description}
                      >
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <Icon className={`w-8 h-8 mx-auto mb-3 ${metric.color} group-hover:scale-110 transition-transform duration-300`} />
                        <p className="text-2xl font-bold font-display mb-1 transition-all duration-500">{metric.value}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{metric.label}</p>
                        <p className="text-xs text-muted-foreground/70 italic">{metric.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="animate-slide-in-right">
                <ActivityFeed />
              </div>
              <div className="animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                <NotificationPanel />
              </div>
              <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                <WeatherWidget />
              </div>
              <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
                <QuickActions />
              </div>
            </div>

            {/* Charts Section */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <StatsChart />
            </div>

            {/* Security Notice */}
            <Card className="bg-gradient-surface border-primary/20 shadow-government animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <CardContent className="p-8">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl font-display mb-2">Secure & Compliant Platform</h3>
                    <p className="text-muted-foreground mb-4">
                      This platform follows government security protocols and data privacy standards. 
                      All tourist data is encrypted and stored securely with blockchain verification.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2 bg-safety/10 px-3 py-1 rounded-full">
                        <CheckCircle className="w-4 h-4 text-safety" />
                        <span className="text-sm">ISO 27001 Certified</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-safety/10 px-3 py-1 rounded-full">
                        <Shield className="w-4 h-4 text-safety" />
                        <span className="text-sm">End-to-End Encryption</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-safety/10 px-3 py-1 rounded-full">
                        <Clock className="w-4 h-4 text-safety" />
                        <span className="text-sm">24/7 Monitoring</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeView === 'iot' && <IoTMonitor />}
        {activeView === 'tourists' && <TouristManagement />}
        {activeView === 'notifications' && <NotificationSystem />}
      </div>
    </div>
  );
};

export default Dashboard;