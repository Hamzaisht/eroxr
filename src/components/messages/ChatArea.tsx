import { useState, useEffect, useRef } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, Info, Search, MoreVertical, Smile, Paperclip, Mic, Send, Camera, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MediaUploadDialog } from './MediaUploadDialog';
import { VoiceRecorderDialog } from './VoiceRecorderDialog';
import { BookingDialog } from './BookingDialog';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  message_type?: 'text' | 'image' | 'video' | 'audio' | 'file';
  original_content?: string;
  is_edited?: boolean;
  delivery_status?: 'sending' | 'sent' | 'delivered' | 'seen';
}

interface ChatAreaProps {
  conversationId: string;
  onShowDetails: () => void;
}

export const ChatArea = ({ conversationId, onShowDetails }: ChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (!conversationId || !session?.user?.id) return;

    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', conversationId)
          .single();

        if (error) throw error;
        setUserProfile({
          ...data,
          isOnline: Math.random() > 0.5, // Mock online status
          lastSeen: new Date()
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('direct_messages')
          .select('*')
          .or(`and(sender_id.eq.${session.user.id},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${session.user.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchUserProfile();
    fetchMessages();
  }, [conversationId, session?.user?.id]);

  // Real-time message subscription
  useEffect(() => {
    if (!conversationId || !session?.user?.id) return;

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `or(and(sender_id.eq.${session.user.id},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${session.user.id}))`
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
  }, [conversationId, session?.user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !session?.user?.id) return;

    setSending(true);
    const messageContent = newMessage;
    setNewMessage('');

    // Add typing animation
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 500);

    try {
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          content: messageContent,
          sender_id: session.user.id,
          recipient_id: conversationId,
          message_type: 'text'
        });

      if (error) throw error;

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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col bg-black/10">
      {/* Chat Header */}
      <motion.div 
        className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-white/20">
                <AvatarImage src={userProfile?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-primary/30 to-purple-500/30 text-white">
                  {userProfile?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {userProfile?.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-white">{userProfile?.username}</h3>
              <p className="text-sm text-white/60">
                {userProfile?.isOnline ? 'Online' : 'Last seen recently'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setShowBookingDialog(true)}
            >
              <Calendar className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Video className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={onShowDetails}
            >
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => {
            const isOwn = message.sender_id === session?.user?.id;
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 30,
                  mass: 0.8 
                }}
                whileHover={{ scale: 1.02 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                  {!isOwn && (
                    <motion.div 
                      className="flex items-center gap-2 mb-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={userProfile?.avatar_url} />
                        <AvatarFallback className="text-xs bg-primary/20">
                          {userProfile?.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                       <span className="text-xs text-white/60">{userProfile?.username}</span>
                     </motion.div>
                  )}
                  
                  <motion.div
                    className={`px-4 py-3 rounded-2xl relative overflow-hidden group ${
                      isOwn
                        ? 'bg-gradient-to-r from-primary to-purple-500 text-white rounded-br-lg shadow-lg shadow-primary/30'
                        : 'bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-bl-lg'
                    }`}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { type: "spring", stiffness: 400, damping: 17 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                    
                    <motion.p 
                      className="text-sm leading-relaxed relative z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {message.content}
                    </motion.p>
                    
                    <div className={`flex items-center gap-1 mt-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <motion.span 
                        className={`text-xs ${isOwn ? 'text-white/80' : 'text-white/60'}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {formatTime(message.created_at)}
                      </motion.span>
                      {isOwn && (
                        <motion.div 
                          className="flex gap-1"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4, type: "spring" }}
                        >
                          <div className={`w-1 h-1 rounded-full ${
                            message.delivery_status === 'seen' ? 'bg-blue-400' : 
                            message.delivery_status === 'delivered' ? 'bg-white/60' :
                            'bg-white/40'
                          }`} />
                          <div className={`w-1 h-1 rounded-full ${
                            message.delivery_status === 'seen' ? 'bg-blue-400' : 
                            'bg-white/40'
                          }`} />
                         </motion.div>
                       )}
                     </div>
                   </motion.div>
                 </div>
               </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 backdrop-blur-xl px-4 py-3 rounded-2xl rounded-bl-lg border border-white/20">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <motion.div 
        className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-end gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setShowMediaDialog(true)}
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Camera className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-16 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary/50 rounded-full"
            />
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>

          {newMessage.trim() ? (
            <Button
              onClick={sendMessage}
              disabled={sending}
              className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 rounded-full"
            >
              {sending ? (
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setShowVoiceDialog(true)}
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </motion.div>

      {/* Dialogs */}
      <MediaUploadDialog 
        open={showMediaDialog}
        onOpenChange={setShowMediaDialog}
        onSendMedia={(url, type) => {
          // Handle media send
          setShowMediaDialog(false);
        }}
      />
      
      <VoiceRecorderDialog 
        open={showVoiceDialog}
        onOpenChange={setShowVoiceDialog}
        onSendVoice={(url) => {
          // Handle voice send
          setShowVoiceDialog(false);
        }}
      />
      
      <BookingDialog 
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        recipientId={userProfile?.id}
        recipientName={userProfile?.username}
      />
    </div>
  );
};