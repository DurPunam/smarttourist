import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Send, 
  Bell,
  Settings,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create safety report',
      icon: FileText,
      variant: 'government' as const,
      action: () => console.log('Generate report')
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download tourist data',
      icon: Download,
      variant: 'outline' as const,
      action: () => console.log('Export data')
    },
    {
      id: 'send-alert',
      title: 'Send Alert',
      description: 'Broadcast safety alert',
      icon: Send,
      variant: 'warning' as const,
      action: () => console.log('Send alert')
    }
  ];

  return (
    <Card className="shadow-card-custom">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-primary" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant={action.variant}
              className="w-full justify-start h-auto p-4"
              onClick={action.action}
            >
              <Icon className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">{action.title}</p>
                <p className="text-xs opacity-80">{action.description}</p>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default QuickActions;