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
    // Mock user profile - replace with real data
    setUserProfile({
      id: 'user1',
      username: 'Aphrodite',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      isOnline: true,
      lastSeen: new Date()
    });

    // Mock messages - replace with real Supabase query
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Hey! How are you doing today? 💫',
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        sender_id: 'user1',
        recipient_id: session?.user?.id || '',
        delivery_status: 'seen'
      },
      {
        id: '2',
        content: 'I am doing great! Just finished an amazing photoshoot. How about you?',
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        sender_id: session?.user?.id || '',
        recipient_id: 'user1',
        delivery_status: 'seen'
      },
      {
        id: '3',
        content: 'That sounds amazing! I would love to see some of the photos',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        sender_id: 'user1',
        recipient_id: session?.user?.id || '',
        delivery_status: 'seen'
      },
      {
        id: '4',
        content: 'Sure! Let me share a few with you. They turned out really beautiful ✨',
        created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        sender_id: session?.user?.id || '',
        recipient_id: 'user1',
        delivery_status: 'delivered'
      }
    ];
    setMessages(mockMessages);
  }, [conversationId, session?.user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const messageContent = newMessage;
    setNewMessage('');

    // Optimistic update
    const optimisticMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      created_at: new Date().toISOString(),
      sender_id: session?.user?.id || '',
      recipient_id: userProfile?.id || '',
      delivery_status: 'sending'
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      // Replace with real Supabase insert
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      
      // Update message status
      setMessages(prev => prev.map(msg => 
        msg.id === optimisticMessage.id 
          ? { ...msg, delivery_status: 'sent' }
          : msg
      ));
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      });
      
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
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
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                  {!isOwn && (
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={userProfile?.avatar_url} />
                        <AvatarFallback className="text-xs bg-primary/20">
                          {userProfile?.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-white/60">{userProfile?.username}</span>
                    </div>
                  )}
                  
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      isOwn
                        ? 'bg-gradient-to-r from-primary to-purple-500 text-white rounded-br-lg'
                        : 'bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-bl-lg'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    <div className={`flex items-center gap-1 mt-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <span className={`text-xs ${isOwn ? 'text-white/80' : 'text-white/60'}`}>
                        {formatTime(message.created_at)}
                      </span>
                      {isOwn && (
                        <div className="flex gap-1">
                          <div className={`w-1 h-1 rounded-full ${
                            message.delivery_status === 'seen' ? 'bg-blue-400' : 
                            message.delivery_status === 'delivered' ? 'bg-white/60' :
                            message.delivery_status === 'sent' ? 'bg-white/60' : 'bg-white/40'
                          }`} />
                          <div className={`w-1 h-1 rounded-full ${
                            message.delivery_status === 'seen' ? 'bg-blue-400' : 
                            message.delivery_status === 'delivered' ? 'bg-white/60' :
                            'bg-white/40'
                          }`} />
                        </div>
                      )}
                    </div>
                  </div>
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