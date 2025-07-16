import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Database, 
  Wifi, 
  Shield, 
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface SystemMetric {
  label: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  unit?: string;
}

export const SystemHealth: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { label: 'Server Load', value: 0, status: 'healthy', icon: Server, unit: '%' },
    { label: 'Database', value: 0, status: 'healthy', icon: Database, unit: '%' },
    { label: 'CDN Status', value: 0, status: 'healthy', icon: Wifi, unit: '%' },
    { label: 'Security', value: 0, status: 'healthy', icon: Shield, unit: '%' },
  ]);

  const [systemStatus, setSystemStatus] = useState<'online' | 'degraded' | 'offline'>('online');

  useEffect(() => {
    const updateMetrics = () => {
      // Simulate real system metrics
      const newMetrics: SystemMetric[] = [
        {
          label: 'Server Load',
          value: Math.floor(Math.random() * 30) + 20, // 20-50%
          status: 'healthy',
          icon: Server,
          unit: '%'
        },
        {
          label: 'Database',
          value: Math.floor(Math.random() * 20) + 80, // 80-100%
          status: 'healthy',
          icon: Database,
          unit: '%'
        },
        {
          label: 'CDN Status',
          value: Math.floor(Math.random() * 10) + 90, // 90-100%
          status: 'healthy',
          icon: Wifi,
          unit: '%'
        },
        {
          label: 'Security',
          value: Math.floor(Math.random() * 5) + 95, // 95-100%
          status: 'healthy',
          icon: Shield,
          unit: '%'
        },
      ];

      // Determine status based on values
      newMetrics.forEach(metric => {
        if (metric.value < 60) metric.status = 'critical';
        else if (metric.value < 80) metric.status = 'warning';
        else metric.status = 'healthy';
      });

      setMetrics(newMetrics);

      // Overall system status
      const hasCritical = newMetrics.some(m => m.status === 'critical');
      const hasWarning = newMetrics.some(m => m.status === 'warning');

      if (hasCritical) setSystemStatus('offline');
      else if (hasWarning) setSystemStatus('degraded');
      else setSystemStatus('online');
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
    }
  };

  const getProgressColor = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
    }
  };

  const getSystemStatusBadge = () => {
    switch (systemStatus) {
      case 'online':
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            All Systems Operational
          </Badge>
        );
      case 'degraded':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Degraded Performance
          </Badge>
        );
      case 'offline':
        return (
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Service Issues
          </Badge>
        );
    }
  };

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Health
        </CardTitle>
        {getSystemStatusBadge()}
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <metric.icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                <span className="text-sm text-gray-300">{metric.label}</span>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(metric.status)}`}>
                {metric.value}{metric.unit}
              </span>
            </div>
            <Progress 
              value={metric.value} 
              className="h-2"
              style={{
                '--progress-background': getProgressColor(metric.status)
              } as React.CSSProperties}
            />
          </div>
        ))}

        {/* Additional System Info */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Uptime</span>
            <span>99.9%</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Active Admins</span>
            <span>3</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Ghost Sessions</span>
            <span>1</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Last Updated</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};