import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Video, Users, Eye, AlertCircle, Play } from 'lucide-react';
import { useAdminSession } from '@/contexts/AdminSessionContext';

interface LiveStream {
  id: string;
  title: string;
  creator_id: string;
  viewer_count: number;
  status: string;
  is_private: boolean;
  started_at: string;
  creator: {
    username: string;
    avatar_url: string;
  };
}

export const LiveStreams: React.FC = () => {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logGhostAction, isGhostMode } = useAdminSession();

  useEffect(() => {
    const fetchLiveStreams = async () => {
      try {
        const { data } = await supabase
          .from('live_streams')
          .select(`
            id,
            title,
            creator_id,
            viewer_count,
            status,
            is_private,
            started_at,
            profiles:creator_id(username, avatar_url)
          `)
          .eq('status', 'live')
          .order('viewer_count', { ascending: false })
          .limit(10);

        const formattedStreams = data?.map(stream => ({
          ...stream,
          creator: {
            username: (stream.profiles as any)?.username || 'Unknown',
            avatar_url: (stream.profiles as any)?.avatar_url || ''
          }
        })) || [];
        setStreams(formattedStreams);
      } catch (error) {
        console.error('Failed to fetch live streams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveStreams();
    const interval = setInterval(fetchLiveStreams, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const handleViewStream = async (stream: LiveStream) => {
    if (isGhostMode) {
      await logGhostAction('view_live_stream', 'stream', stream.id, {
        stream_title: stream.title,
        creator_id: stream.creator_id
      });
    }
    // Open stream in new tab or modal
    window.open(`/streams/${stream.id}`, '_blank');
  };

  const handleModerateStream = async (stream: LiveStream) => {
    await logGhostAction('moderate_stream', 'stream', stream.id, {
      action: 'moderate',
      stream_title: stream.title
    });
    // Implement moderation actions
  };

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Video className="h-5 w-5" />
            Live Streams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-white/10 rounded-lg" />
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
        <CardTitle className="text-white flex items-center gap-2">
          <Video className="h-5 w-5" />
          Live Streams ({streams.length})
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </CardHeader>
      <CardContent>
        {streams.length === 0 ? (
          <div className="text-center py-8">
            <Video className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No live streams currently</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {streams.map((stream) => (
              <div key={stream.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={stream.creator.avatar_url} />
                      <AvatarFallback className="bg-purple-600 text-white text-xs">
                        {stream.creator.username[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {stream.creator.username}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500/20 text-red-300 text-xs">
                          LIVE
                        </Badge>
                        {stream.is_private && (
                          <Badge className="bg-orange-500/20 text-orange-300 text-xs">
                            Private
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <h4 className="text-sm font-medium text-white mb-2 line-clamp-2">
                  {stream.title}
                </h4>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{stream.viewer_count}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(stream.started_at).toLocaleTimeString()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    onClick={() => handleViewStream(stream)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                    onClick={() => handleModerateStream(stream)}
                  >
                    <AlertCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};