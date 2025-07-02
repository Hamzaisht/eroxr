
import { useState, useEffect, useRef } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Phone, Video, MoreVertical, Smile, Paperclip } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export interface ChatWindowProps {
  userId: string;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
}

interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
}

export const ChatWindow = ({ userId }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('direct_messages')
          .select('id, content, created_at, sender_id, recipient_id')
          .or(`and(sender_id.eq.${session?.user?.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${session?.user?.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error loading messages",
          description: "Failed to load conversation history",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId && session?.user?.id) {
      fetchUserProfile();
      fetchMessages();
    }
  }, [userId, session?.user?.id, toast]);

  // Real-time message subscription
  useEffect(() => {
    if (!session?.user?.id || !userId) return;

    const channel = supabase
      .channel('direct_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `or(and(sender_id.eq.${session.user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${session.user.id}))`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, userId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !session?.user?.id || sending) return;

    setSending(true);
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .insert({
          content: newMessage,
          sender_id: session.user.id,
          recipient_id: userId,
          message_type: 'text'
        })
        .select()
        .single();

      if (error) throw error;

      setNewMessage('');
      // Message will be added via real-time subscription
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/60">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Chat Header */}
      <motion.div 
        className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.02]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-white/20">
            <AvatarImage src={userProfile?.avatar_url || ""} alt={userProfile?.username} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-500/20 text-white">
              {userProfile?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-white">{userProfile?.username || 'Unknown User'}</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-sm text-white/60">Online</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hover:bg-white/10 text-white/60 hover:text-white">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-white/10 text-white/60 hover:text-white">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-white/10 text-white/60 hover:text-white">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const isOwn = message.sender_id === session?.user?.id;
              const isLastInGroup = index === messages.length - 1 || 
                messages[index + 1]?.sender_id !== message.sender_id;
              
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      isOwn
                        ? 'bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/20'
                        : 'bg-white/10 text-white backdrop-blur-sm border border-white/10'
                    } ${isLastInGroup ? (isOwn ? 'rounded-br-md' : 'rounded-bl-md') : ''}`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-white/80' : 'text-white/60'}`}>
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <motion.div 
        className="p-4 border-t border-white/10 bg-white/[0.02]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-white/10 text-white/60 hover:text-white"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending}
              className="bg-white/10 border-white/10 text-white placeholder:text-white/40 focus:border-primary/50 pr-12"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-white/10 text-white/60 hover:text-white"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || sending}
            className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 border-0 shadow-lg shadow-primary/20"
          >
            {sending ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
