
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
    <div className="flex flex-col h-full holographic-card relative overflow-hidden group">
      {/* Quantum background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Chat Header */}
      <motion.div 
        className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02] backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white/20 shadow-lg shadow-primary/20">
              <AvatarImage src={userProfile?.avatar_url || ""} alt={userProfile?.username} />
              <AvatarFallback className="bg-gradient-to-br from-primary/30 to-purple-500/30 text-white font-semibold">
                {userProfile?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {/* Neural activity indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black/50 animate-pulse shadow-lg shadow-green-400/50" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400/30 rounded-full animate-ping" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{userProfile?.username || 'Unknown Entity'}</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-green-400/80 font-medium">Neural link active</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="group relative overflow-hidden p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Phone className="h-4 w-4 text-white/70 group-hover:text-white relative z-10" />
          </button>
          <button className="group relative overflow-hidden p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Video className="h-4 w-4 text-white/70 group-hover:text-white relative z-10" />
          </button>
          <button className="group relative overflow-hidden p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <MoreVertical className="h-4 w-4 text-white/70 group-hover:text-white relative z-10" />
          </button>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 relative overflow-hidden">
        <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const isOwn = message.sender_id === session?.user?.id;
              const isLastInGroup = index === messages.length - 1 || 
                messages[index + 1]?.sender_id !== message.sender_id;
              
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`group relative max-w-xs lg:max-w-md transition-all duration-300 hover:scale-[1.02] ${
                      isOwn ? 'ml-auto' : 'mr-auto'
                    }`}
                  >
                    {/* Message bubble */}
                    <div
                      className={`relative overflow-hidden px-5 py-3 ${
                        isOwn
                          ? 'bg-gradient-to-r from-primary via-primary/90 to-purple-500 text-white shadow-xl shadow-primary/30 rounded-3xl rounded-br-lg'
                          : 'bg-white/[0.08] backdrop-blur-xl text-white border border-white/20 shadow-lg shadow-white/10 rounded-3xl rounded-bl-lg'
                      }`}
                    >
                      {/* Neural transmission effect for own messages */}
                      {isOwn && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                      )}
                      
                      {/* Message content */}
                      <p className="text-sm leading-relaxed relative z-10 font-medium">{message.content}</p>
                      
                      {/* Timestamp with enhanced styling */}
                      <div className={`flex items-center gap-2 mt-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <p className={`text-xs font-mono relative z-10 ${
                          isOwn ? 'text-white/80' : 'text-white/60'
                        }`}>
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {isOwn && (
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-white/60 rounded-full" />
                            <div className="w-1 h-1 bg-white/60 rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Quantum transmission indicator */}
                    {isOwn && (
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Neural Input Interface */}
      <motion.div 
        className="relative z-10 p-6 border-t border-white/10 bg-white/[0.02] backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Transmission indicator */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="flex items-end gap-4">
          {/* Attachment button */}
          <button className="group relative overflow-hidden p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 transition-all duration-300 hover:scale-105 mb-2">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Paperclip className="h-4 w-4 text-white/70 group-hover:text-white relative z-10" />
          </button>
          
          {/* Message input container */}
          <div className="flex-1 relative">
            <div className="relative group">
              {/* Input field */}
              <textarea
                placeholder="Transmit neural message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={sending}
                rows={1}
                className="w-full resize-none px-6 py-4 pr-16 bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-primary/50 focus:bg-white/[0.12] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-primary/20"
                style={{ 
                  minHeight: '56px',
                  maxHeight: '120px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              
              {/* Emoji button */}
              <button className="absolute right-16 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 group">
                <Smile className="h-4 w-4 text-white/60 group-hover:text-white" />
              </button>
              
              {/* Neural transmission lines */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none">
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" style={{ transitionDelay: '200ms' }} />
              </div>
            </div>
          </div>
          
          {/* Send button */}
          <button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || sending}
            className="group relative overflow-hidden bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 disabled:from-white/10 disabled:to-white/10 p-4 rounded-xl border-0 shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:shadow-none mb-2"
          >
            {/* Quantum transmission effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            
            {/* Button content */}
            <div className="relative z-10 flex items-center justify-center">
              {sending ? (
                <div className="relative">
                  <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                  <div className="absolute inset-0 animate-ping h-5 w-5 border border-white/20 rounded-full" />
                </div>
              ) : (
                <Send className="h-5 w-5 text-white" />
              )}
            </div>
            
            {/* Transmission ready indicator */}
            {!sending && newMessage.trim() && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
            )}
          </button>
        </div>
        
        {/* Neural activity indicator */}
        <div className="flex items-center justify-center mt-4 gap-2">
          <div className="w-1 h-1 bg-primary/60 rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-purple-500/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="w-1 h-1 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </motion.div>
    </div>
  );
};
