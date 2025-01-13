import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { LiveStreamViewer } from './LiveStreamViewer';

export const LiveStreams = () => {
  const [streams, setStreams] = useState<any[]>([]);
  const [selectedStream, setSelectedStream] = useState<any>(null);

  useEffect(() => {
    // Load active streams
    const loadStreams = async () => {
      const { data } = await supabase
        .from('live_streams')
        .select(`
          *,
          profiles:creator_id (
            username,
            avatar_url
          )
        `)
        .eq('status', 'live')
        .order('viewer_count', { ascending: false });

      if (data) setStreams(data);
    };

    loadStreams();

    // Subscribe to new streams
    const channel = supabase
      .channel('public:live_streams')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_streams'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setStreams((current) => [payload.new, ...current]);
          } else if (payload.eventType === 'DELETE') {
            setStreams((current) => 
              current.filter((stream) => stream.id !== payload.old.id)
            );
          } else if (payload.eventType === 'UPDATE') {
            setStreams((current) =>
              current.map((stream) =>
                stream.id === payload.new.id ? payload.new : stream
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (selectedStream) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedStream(null)}
          className="text-sm text-luxury-neutral hover:text-white"
        >
          ← Back to all streams
        </button>
        <LiveStreamViewer
          streamId={selectedStream.id}
          playbackUrl={selectedStream.playback_url}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {streams.map((stream) => (
        <Card
          key={stream.id}
          className="p-4 cursor-pointer hover:bg-luxury-dark/20 transition-colors"
          onClick={() => setSelectedStream(stream)}
        >
          <div className="aspect-video bg-black rounded-lg mb-4">
            {/* Thumbnail would go here */}
          </div>
          <div className="flex items-center gap-2">
            <img
              src={stream.profiles?.avatar_url || '/placeholder.svg'}
              alt={stream.profiles?.username}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <h3 className="font-medium">{stream.title}</h3>
              <p className="text-sm text-luxury-neutral">
                {stream.profiles?.username}
              </p>
            </div>
            <div className="ml-auto text-sm text-luxury-neutral">
              {stream.viewer_count} viewing
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};