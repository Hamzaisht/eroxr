import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { 
  User, 
  FileImage, 
  MessageSquare, 
  Flag, 
  Shield,
  Eye,
  DollarSign,
  Activity
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  user: string;
  timestamp: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        // Fetch recent admin action logs
        const { data: logs } = await supabase
          .from('admin_action_logs')
          .select(`
            id,
            action_type,
            action,
            target_type,
            created_at,
            details,
            profiles:admin_id(username, email)
          `)
          .order('created_at', { ascending: false })
          .limit(20);

        const formattedActivities: ActivityItem[] = (logs || []).map(log => ({
          id: log.id,
          type: log.action_type,
          description: `${log.action.replace(/_/g, ' ')} ${log.target_type || ''}`.trim(),
          user: (log.profiles as any)?.username || (log.profiles as any)?.email || 'System',
          timestamp: log.created_at,
          severity: getSeverityFromAction(log.action_type)
        }));

        setActivities(formattedActivities);
      } catch (error) {
        console.error('Failed to fetch activity:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentActivity();
    const interval = setInterval(fetchRecentActivity, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getSeverityFromAction = (actionType: string): 'low' | 'medium' | 'high' | 'critical' => {
    switch (actionType) {
      case 'ghost_surveillance': return 'medium';
      case 'content_moderation': return 'high';
      case 'user_action': return 'critical';
      case 'system_admin': return 'high';
      default: return 'low';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'user_action': return <User className="h-4 w-4" />;
      case 'content_moderation': return <FileImage className="h-4 w-4" />;
      case 'ghost_surveillance': return <Eye className="h-4 w-4" />;
      case 'verification': return <Shield className="h-4 w-4" />;
      case 'payout_management': return <DollarSign className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-300 border-green-500/30';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-white/10 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Recent Activity</CardTitle>
        <Badge className="bg-green-500/20 text-green-300">
          Live Updates
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <div className={`p-2 rounded-full ${getSeverityColor(activity.severity || 'low')}`}>
                  {getActionIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white capitalize">
                      {activity.description}
                    </p>
                    <Badge variant="outline" className={getSeverityColor(activity.severity || 'low')}>
                      {activity.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="bg-purple-600 text-white text-xs">
                        {activity.user[0]?.toUpperCase() || 'S'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-400">{activity.user}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};