import { useEffect, useRef, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';

interface LiveStreamViewerProps {
  streamId: string;
  playbackUrl: string;
}

export const LiveStreamViewer = ({ streamId, playbackUrl }: LiveStreamViewerProps) => {
  const session = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

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

    // Track viewer presence
    if (session?.user?.id) {
      viewerChannel.track({
        user_id: session.user.id,
        online_at: new Date().toISOString(),
      });
    }

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(viewerChannel);
    };
  }, [streamId, session?.user?.id]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !newMessage.trim()) return;

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
          {viewerCount} viewing
        </div>
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
      </div>
    </div>
  );
};