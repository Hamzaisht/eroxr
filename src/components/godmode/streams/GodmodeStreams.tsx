import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { Video, Eye, Users, Clock, Play, Square, MoreVertical, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StreamData {
  id: string;
  title: string;
  creator_id: string;
  creator_username?: string;
  creator_avatar?: string;
  status: 'live' | 'offline' | 'ended';
  viewer_count: number;
  started_at?: string;
  ended_at?: string;
  is_private: boolean;
  description?: string;
}

interface StreamStats {
  total_streams: number;
  live_streams: number;
  total_viewers: number;
  peak_concurrent: number;
  today_streams: number;
  revenue_today: number;
}

export const GodmodeStreams: React.FC = () => {
  const { isGhostMode, logGhostAction } = useAdminSession();
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [stats, setStats] = useState<StreamStats>({
    total_streams: 0,
    live_streams: 0,
    total_viewers: 0,
    peak_concurrent: 0,
    today_streams: 0,
    revenue_today: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStreams = async () => {
    try {
      // Get live streams with creator info
      const { data: streams } = await supabase
        .from('live_streams')
        .select(`
          id,
          title,
          creator_id,
          status,
          viewer_count,
          started_at,
          ended_at,
          is_private,
          description,
          profiles:creator_id (
            username,
            avatar_url
          )
        `)
        .order('started_at', { ascending: false })
        .limit(50);

      const formattedStreams: StreamData[] = streams?.map(stream => ({
        id: stream.id,
        title: stream.title,
        creator_id: stream.creator_id,
        creator_username: (stream.profiles as any)?.username || 'Unknown',
        creator_avatar: (stream.profiles as any)?.avatar_url,
        status: stream.status,
        viewer_count: stream.viewer_count || 0,
        started_at: stream.started_at,
        ended_at: stream.ended_at,
        is_private: stream.is_private,
        description: stream.description
      })) || [];

      setStreams(formattedStreams);

      // Calculate stats
      const liveStreams = formattedStreams.filter(s => s.status === 'live');
      const totalViewers = liveStreams.reduce((sum, s) => sum + s.viewer_count, 0);
      const today = new Date().toISOString().split('T')[0];
      const todayStreams = formattedStreams.filter(s => 
        s.started_at && s.started_at.startsWith(today)
      );

      setStats({
        total_streams: formattedStreams.length,
        live_streams: liveStreams.length,
        total_viewers: totalViewers,
        peak_concurrent: Math.max(...liveStreams.map(s => s.viewer_count), 0),
        today_streams: todayStreams.length,
        revenue_today: Math.random() * 5000 // Mock data
      });
    } catch (error) {
      console.error('Error fetching streams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams();

    // Real-time updates
    const channel = supabase
      .channel('live_streams_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_streams' }, fetchStreams)
      .subscribe();

    // Refresh every 30 seconds for viewer counts
    const interval = setInterval(fetchStreams, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const handleStreamAction = async (streamId: string, action: string) => {
    if (isGhostMode) {
      await logGhostAction(`Stream ${action}`, 'stream', streamId, { action, timestamp: new Date().toISOString() });
    }
    // Implement stream actions
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      case 'ended': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Play className="h-3 w-3" />;
      case 'offline': return <Square className="h-3 w-3" />;
      case 'ended': return <Square className="h-3 w-3" />;
      default: return <AlertTriangle className="h-3 w-3" />;
    }
  };

  const formatDuration = (startTime?: string, endTime?: string) => {
    if (!startTime) return 'N/A';
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Stream Management</h1>
          <p className="text-gray-400">Monitor and manage live streams</p>
        </div>
        {isGhostMode && (
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
            <Eye className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300">Ghost Mode Active</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Streams</p>
                <p className="text-2xl font-bold text-white">{stats.total_streams}</p>
              </div>
              <Video className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Live Now</p>
                <p className="text-2xl font-bold text-red-400">{stats.live_streams}</p>
              </div>
              <Play className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Viewers</p>
                <p className="text-2xl font-bold text-green-400">{stats.total_viewers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Peak Concurrent</p>
                <p className="text-2xl font-bold text-purple-400">{stats.peak_concurrent.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Today</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.today_streams}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Revenue Today</p>
                <p className="text-2xl font-bold text-green-400">${stats.revenue_today.toFixed(0)}</p>
              </div>
              <Video className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streams Table */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Live & Recent Streams</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Stream</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Creator</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Viewers</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Duration</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Type</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {streams.map((stream) => (
                  <tr key={stream.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{stream.title}</p>
                        {stream.description && (
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{stream.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={stream.creator_avatar} />
                          <AvatarFallback className="bg-purple-500 text-white text-xs">
                            {stream.creator_username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white text-sm">{stream.creator_username}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getStatusColor(stream.status)} text-white border-none`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(stream.status)}
                          {stream.status.toUpperCase()}
                        </div>
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-white">{stream.viewer_count.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400 text-sm">
                        {formatDuration(stream.started_at, stream.ended_at)}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={stream.is_private ? 'destructive' : 'secondary'}>
                        {stream.is_private ? 'Private' : 'Public'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStreamAction(stream.id, 'view')}
                        className="h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};