import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Shield, 
  Users, 
  Building2, 
  MapPin, 
  Smartphone,
  ArrowRight,
  Globe
} from 'lucide-react';

const DirectAccess = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'tourist',
      title: 'Tourist Dashboard',
      description: 'Access digital ID, tourist app, and travel features',
      icon: <User className="h-8 w-8" />,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      features: ['Digital ID', 'Tourist App', 'Travel Info', 'Emergency Contacts'],
      route: '/tourist-app'
    },
    {
      id: 'admin',
      title: 'Admin Dashboard',
      description: 'Full system access, user management, and approvals',
      icon: <Shield className="h-8 w-8" />,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      features: ['User Management', 'Approvals', 'System Settings', 'Analytics'],
      route: '/admin'
    },
    {
      id: 'police',
      title: 'Police Dashboard',
      description: 'Law enforcement tools, IoT monitoring, and emergency response',
      icon: <Users className="h-8 w-8" />,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      features: ['IoT Monitor', 'Emergency Response', 'Tourist Tracking', 'Reports'],
      route: '/police-dashboard'
    },
    {
      id: 'id_issuer',
      title: 'ID Issuer Center',
      description: 'Issue and verify tourist IDs, manage verification process',
      icon: <Building2 className="h-8 w-8" />,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      features: ['ID Verification', 'Document Processing', 'Tourist Registration', 'QR Codes'],
      route: '/id-verification'
    }
  ];

  const handleDirectAccess = (role: string, route: string) => {
    // Set user role in localStorage for the session
    localStorage.setItem('userRole', role);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', `${role.charAt(0).toUpperCase() + role.slice(1)} User`);
    localStorage.setItem('userEmail', `${role}@direct-access.com`);
    
    // Navigate to the specific dashboard
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Tourist Platform</h1>
                <p className="text-gray-600">Direct Access Portal</p>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-200">
              Development Mode
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select a role to access the corresponding dashboard directly. 
            No login required for development and testing purposes.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <Card key={role.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className={`${role.color} ${role.hoverColor} p-3 rounded-lg w-fit mb-4 text-white transition-colors`}>
                  {role.icon}
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {role.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Features List */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Access Button */}
                <Button 
                  onClick={() => handleDirectAccess(role.id, role.route)}
                  className="w-full group-hover:bg-blue-600 transition-colors"
                  size="lg"
                >
                  Access Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🚀 Development Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Smartphone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Instant Access</h4>
                  <p className="text-gray-600 text-sm">No authentication required for testing</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Full Functionality</h4>
                  <p className="text-gray-600 text-sm">All features available for testing</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Role-Based UI</h4>
                  <p className="text-gray-600 text-sm">Different interfaces for each role</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectAccess;
