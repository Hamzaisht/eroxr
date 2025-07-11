import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Ghost, 
  Eye, 
  EyeOff, 
  Search, 
  Activity,
  AlertTriangle,
  Users,
  MessageSquare,
  Video,
  Camera,
  Target,
  Clock
} from 'lucide-react';

interface SurveillanceTarget {
  id: string;
  username: string;
  avatar_url?: string;
  online: boolean;
  activity: 'idle' | 'posting' | 'messaging' | 'streaming';
  last_seen: string;
  flags: number;
}

interface LiveAlert {
  id: string;
  type: 'content' | 'behavior' | 'financial';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id: string;
  username: string;
  description: string;
  timestamp: string;
}

export const GhostModePanel: React.FC = () => {
  const { isGhostMode, toggleGhostMode, logGhostAction, liveAlerts, refreshAlerts } = useAdminSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [surveillanceTargets, setSurveillanceTargets] = useState<SurveillanceTarget[]>([]);
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isGhostMode) {
      fetchSurveillanceData();
      refreshAlerts();
      
      // Set up real-time monitoring
      const interval = setInterval(() => {
        fetchSurveillanceData();
        refreshAlerts();
      }, 10000); // Every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isGhostMode]);

  const fetchSurveillanceData = async () => {
    try {
      // Fetch users with potential flags
      const { data: flaggedUsers } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          avatar_url,
          last_active_at,
          created_at
        `)
        .order('last_active_at', { ascending: false })
        .limit(20);

      // Fetch recent flagged content for alerts
      const { data: flaggedContent } = await supabase
        .from('flagged_content')
        .select(`
          id,
          content_type,
          reason,
          severity,
          flagged_at,
          user_id
        `)
        .eq('status', 'pending')
        .order('flagged_at', { ascending: false })
        .limit(10);

      // Process surveillance targets
      const targets: SurveillanceTarget[] = (flaggedUsers || []).map(user => ({
        id: user.id,
        username: user.username || 'Anonymous',
        avatar_url: user.avatar_url,
        online: user.last_active_at && new Date(user.last_active_at) > new Date(Date.now() - 15 * 60 * 1000),
        activity: Math.random() > 0.5 ? 'idle' : Math.random() > 0.5 ? 'posting' : 'messaging',
        last_seen: user.last_active_at || user.created_at,
        flags: Math.floor(Math.random() * 5)
      }));

      // Process alerts
      const processedAlerts: LiveAlert[] = (flaggedContent || []).map(content => ({
        id: content.id,
        type: content.content_type === 'post' ? 'content' : 'behavior',
        severity: content.severity as 'low' | 'medium' | 'high' | 'critical',
        user_id: content.user_id || 'unknown',
        username: 'User',
        description: `${content.reason} detected`,
        timestamp: content.flagged_at
      }));

      setSurveillanceTargets(targets);
      setAlerts(processedAlerts);
    } catch (error) {
      console.error('Failed to fetch surveillance data:', error);
    }
  };

  const handleToggleGhostMode = async () => {
    await toggleGhostMode();
    if (!isGhostMode) {
      await logGhostAction('ghost_mode_activated', 'system', '', {
        timestamp: new Date().toISOString()
      });
    } else {
      await logGhostAction('ghost_mode_deactivated', 'system', '', {
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleWatchUser = async (target: SurveillanceTarget) => {
    await logGhostAction('user_surveillance_started', 'user', target.id, {
      username: target.username,
      reason: 'manual_selection'
    });
    // Implement surveillance modal or redirect
  };

  const handleInvestigateAlert = async (alert: LiveAlert) => {
    await logGhostAction('alert_investigation', 'alert', alert.id, {
      alert_type: alert.type,
      severity: alert.severity,
      user_id: alert.user_id
    });
  };

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'posting': return <MessageSquare className="h-3 w-3" />;
      case 'messaging': return <MessageSquare className="h-3 w-3" />;
      case 'streaming': return <Video className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'posting': return 'text-blue-400';
      case 'messaging': return 'text-green-400';
      case 'streaming': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const filteredTargets = surveillanceTargets.filter(target =>
    target.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Ghost Mode Control */}
      <Card className="bg-black/20 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Ghost className="h-5 w-5 text-purple-400" />
            Ghost Mode Control Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleToggleGhostMode}
                variant={isGhostMode ? "destructive" : "default"}
                className={`${
                  isGhostMode 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {isGhostMode ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Deactivate Ghost Mode
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Activate Ghost Mode
                  </>
                )}
              </Button>
              
              {isGhostMode && (
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 animate-pulse">
                  <Ghost className="h-3 w-3 mr-1" />
                  Invisible Mode Active
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>{filteredTargets.length} Targets</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{alerts.length} Active Alerts</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isGhostMode && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Surveillance Targets */}
          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Surveillance
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTargets.map((target) => (
                  <div key={target.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={target.avatar_url} />
                          <AvatarFallback className="bg-purple-600 text-white">
                            {target.username[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
                          target.online ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{target.username}</p>
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center gap-1 ${getActivityColor(target.activity)}`}>
                            {getActivityIcon(target.activity)}
                            <span className="text-xs capitalize">{target.activity}</span>
                          </div>
                          {target.flags > 0 && (
                            <Badge variant="outline" className="text-xs text-red-400 border-red-400/30">
                              {target.flags} flags
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleWatchUser(target)}
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Watch
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Alerts */}
          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Live Security Alerts
                <Badge className="bg-red-500/20 text-red-300 ml-auto">
                  {alerts.length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-3 bg-white/5 rounded-lg border-l-4 border-red-500/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-white">{alert.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          User: {alert.username} • {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleInvestigateAlert(alert)}
                        className="border-red-500/30 text-red-300 hover:bg-red-500/10 ml-2"
                      >
                        <Camera className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active alerts</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!isGhostMode && (
        <Card className="bg-black/20 backdrop-blur-xl border-white/10">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Ghost className="h-24 w-24 mx-auto mb-6 text-gray-500 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">Ghost Mode Inactive</h3>
              <p className="text-gray-400 mb-6">
                Activate Ghost Mode to begin invisible surveillance and monitoring.
              </p>
              <Button onClick={handleToggleGhostMode} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Eye className="h-4 w-4 mr-2" />
                Enter Ghost Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};