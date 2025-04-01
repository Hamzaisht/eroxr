
import { useEffect, useRef, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Ghost, Camera, AlertTriangle, Pause, Play } from 'lucide-react';
import { useGhostMode } from '@/hooks/useGhostMode';

interface LiveStreamViewerProps {
  streamId: string;
  playbackUrl: string;
}

export const LiveStreamViewer = ({ streamId, playbackUrl }: LiveStreamViewerProps) => {
  const session = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const { isGhostMode } = useGhostMode();

  useEffect(() => {
    if (!streamId) return;

    // Subscribe to chat messages
    const chatChannel = supabase
      .channel(`stream_chat:${streamId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live_stream_chat',
          filter: `stream_id=eq.${streamId}`
        },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
          if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        }
      )
      .subscribe();

    // Subscribe to viewer count updates
    const viewerChannel = supabase
      .channel(`stream:${streamId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = viewerChannel.presenceState();
        setViewerCount(Object.keys(state).length);
      })
      .subscribe();

    // Load existing messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from('live_stream_chat')
        .select('*, profiles:sender_id(username)')
        .eq('stream_id', streamId)
        .order('created_at', { ascending: true });

      if (data) setMessages(data);
    };

    loadMessages();

    // Track viewer presence - only if not in ghost mode
    if (session?.user?.id && !isGhostMode) {
      viewerChannel.track({
        user_id: session.user.id,
        online_at: new Date().toISOString(),
      });
    } else if (session?.user?.id && isGhostMode) {
      // Log ghost mode viewing for audit purposes
      supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: 'ghost_view_stream',
        details: {
          stream_id: streamId,
          timestamp: new Date().toISOString()
        }
      });
    }

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(viewerChannel);
    };
  }, [streamId, session?.user?.id, isGhostMode]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !newMessage.trim() || isGhostMode) return;

    try {
      await supabase
        .from('live_stream_chat')
        .insert([
          {
            stream_id: streamId,
            sender_id: session.user.id,
            message: newMessage.trim()
          }
        ]);

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const captureScreenshot = async () => {
    if (!videoRef.current || !session?.user?.id) return;
    
    try {
      // Create a canvas element to capture the video frame
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Draw the current video frame onto the canvas
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to a data URL (JPEG format, 90% quality)
      const screenshotDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      // Log the screenshot action for audit purposes
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: 'ghost_stream_screenshot',
        details: {
          stream_id: streamId,
          timestamp: new Date().toISOString(),
          screenshot_taken: true
        }
      });
      
      // Download the screenshot
      const link = document.createElement('a');
      link.href = screenshotDataUrl;
      link.download = `stream-${streamId}-${new Date().toISOString()}.jpg`;
      link.click();
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };
  
  const reportStream = async () => {
    if (!session?.user?.id) return;
    
    try {
      // Create a report in the database
      await supabase.from('admin_alerts').insert({
        type: 'flag',
        user_id: session.user.id,
        content_type: 'stream',
        content_id: streamId,
        reason: 'Stream flagged by admin',
        severity: 'high'
      });
      
      // Log the report action for audit purposes
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: 'ghost_stream_flagged',
        details: {
          stream_id: streamId,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error reporting stream:', error);
    }
  };
  
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPaused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    
    setIsPaused(!isPaused);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-4 h-full">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-lg"
          controls
          autoPlay
          playsInline
          src={playbackUrl}
        />
        <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-sm">
          {!isGhostMode && `${viewerCount} viewing`}
          {isGhostMode && (
            <div className="flex items-center gap-2 text-purple-300">
              <Ghost className="h-4 w-4" />
              <span>Ghost Viewing</span>
            </div>
          )}
        </div>
        
        {isGhostMode && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white"
              onClick={togglePlayPause}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white"
              onClick={captureScreenshot}
            >
              <Camera className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="bg-red-900/50 hover:bg-red-900/70 text-white"
              onClick={reportStream}
            >
              <AlertTriangle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col h-[600px] bg-luxury-dark/30 rounded-lg">
        <ScrollArea className="flex-1 p-4" ref={chatRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col">
                <span className="text-sm font-medium">
                  {msg.profiles?.username || 'Anonymous'}:
                </span>
                <p className="text-sm">{msg.message}</p>
              </div>
            ))}
          </div>
        </ScrollArea>

        {!isGhostMode && (
          <form onSubmit={sendMessage} className="p-4 border-t border-luxury-neutral/10">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
        
        {isGhostMode && (
          <div className="p-4 border-t border-luxury-neutral/10 bg-purple-900/20">
            <div className="flex items-center gap-2 text-sm text-purple-300">
              <Ghost className="h-4 w-4" />
              <span>Ghost mode active - Chat disabled</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
