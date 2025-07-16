import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, Info, MoreVertical, Paperclip, Mic, Send, Camera, Calendar, Edit3, Trash2, Heart, HeartOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MediaUploadDialog } from './MediaUploadDialog';
import { VoiceRecorderDialog } from './VoiceRecorderDialog';
import { BookingDialog } from './BookingDialog';
import { CameraDialog } from './CameraDialog';
import { EmojiPicker } from './chat/EmojiPicker';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CallDialog } from './calls/CallDialog';
import { SnapCamera } from './chat/SnapCamera';
import { useDisappearingMessages } from '@/hooks/useDisappearingMessages';
import { Luxury3DButton } from '@/components/ui/luxury-3d-button';
import { LuxuryGlassCard } from '@/components/ui/luxury-glass-card';
import '../../styles/scrollbar.css';

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
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [savedMessages, setSavedMessages] = useState<Set<string>>(new Set());
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const [showSnapCamera, setShowSnapCamera] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Enable disappearing messages cleanup
  useDisappearingMessages();

  useEffect(() => {
    if (!conversationId || !user?.id) return;

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
          .or(`and(sender_id.eq.${user.id},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchUserProfile();
    fetchMessages();
  }, [conversationId, user?.id]);

  // Real-time message subscription
  useEffect(() => {
    if (!conversationId || !user?.id) return;

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `or(and(sender_id.eq.${user.id},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${user.id}))`
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
  }, [conversationId, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !user?.id) return;

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
          sender_id: user.id,
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

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const isMessageEditable = (message: Message): boolean => {
    const messageAge = new Date().getTime() - new Date(message.created_at).getTime();
    const twoHours = 2 * 60 * 60 * 1000;
    return messageAge < twoHours && message.delivery_status !== 'seen';
  };

  const isMessageDeletable = (message: Message): boolean => {
    const messageAge = new Date().getTime() - new Date(message.created_at).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return messageAge < twentyFourHours;
  };

  const handleSaveMessage = async (messageId: string) => {
    const newSavedMessages = new Set(savedMessages);
    if (savedMessages.has(messageId)) {
      newSavedMessages.delete(messageId);
      toast({
        title: "Message unsaved",
        description: "Message removed from saved items"
      });
    } else {
      newSavedMessages.add(messageId);
      toast({
        title: "Message saved",
        description: "Message saved to chat"
      });
    }
    setSavedMessages(newSavedMessages);
  };

  const handleCameraCapture = () => {
    setShowCameraDialog(true);
  };

  const handleEditMessage = async (messageId: string) => {
    if (!editContent.trim()) return;

    try {
      const { error } = await supabase
        .from('direct_messages')
        .update({ 
          content: editContent,
          original_content: messages.find(m => m.id === messageId)?.content,
          is_edited: true 
        })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: editContent, is_edited: true }
          : msg
      ));

      setEditingMessage(null);
      setEditContent('');
      
      toast({
        title: "Message updated",
        description: "Your message has been updated"
      });
    } catch (error) {
      console.error('Error editing message:', error);
      toast({
        title: "Failed to edit message",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('direct_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      toast({
        title: "Message deleted",
        description: "Your message has been deleted"
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Failed to delete message",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Luxury Chat Header */}
      <motion.div 
        className="flex-shrink-0 p-6 border-b border-white/10 bg-gradient-to-r from-black/40 via-slate-900/60 to-black/40 backdrop-blur-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-14 w-14 border-2 border-purple-400/30">
                <AvatarImage src={userProfile?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500/40 to-cyan-500/40 text-white text-lg font-bold">
                  {userProfile?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {userProfile?.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-slate-900 shadow-lg" />
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {userProfile?.username}
              </h3>
              <p className="text-sm text-white/70 font-medium">
                {userProfile?.isOnline ? '✨ Online now' : 'Last seen recently'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Luxury3DButton variant="ghost" size="icon" onClick={() => setShowBookingDialog(true)}>
              <Calendar className="h-5 w-5" />
            </Luxury3DButton>
            <Luxury3DButton variant="ghost" size="icon" onClick={() => { setCallType('audio'); setShowCallDialog(true); }}>
              <Phone className="h-5 w-5" />
            </Luxury3DButton>
            <Luxury3DButton variant="ghost" size="icon" onClick={() => { setCallType('video'); setShowCallDialog(true); }}>
              <Video className="h-5 w-5" />
            </Luxury3DButton>
            <Luxury3DButton variant="ghost" size="icon" onClick={onShowDetails}>
              <Info className="h-5 w-5" />
            </Luxury3DButton>
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 fade-scrollbar">
        <AnimatePresence>
          {messages.map((message) => {
            const isOwn = message.sender_id === user?.id;
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-sm lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                  {!isOwn && (
                    <motion.div 
                      className="flex items-center gap-3 mb-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Avatar className="h-8 w-8 border border-white/20">
                        <AvatarImage src={userProfile?.avatar_url} />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-purple-500/30 to-cyan-500/30 text-white">
                          {userProfile?.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-white/70 font-medium">{userProfile?.username}</span>
                    </motion.div>
                  )}
                  
                  <div className="relative group">
                    <LuxuryGlassCard
                      variant={isOwn ? "primary" : "secondary"}
                      className={`px-6 py-4 ${isOwn ? 'rounded-br-lg' : 'rounded-bl-lg'}`}
                      glow={false}
                    >
                      {editingMessage === message.id ? (
                        <div>
                          <Input
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleEditMessage(message.id);
                              } else if (e.key === 'Escape') {
                                setEditingMessage(null);
                                setEditContent('');
                              }
                            }}
                            className="bg-transparent border-white/30 text-white"
                            autoFocus
                          />
                          <div className="flex gap-2 mt-3">
                            <Luxury3DButton size="sm" onClick={() => handleEditMessage(message.id)} variant="primary">
                              Save
                            </Luxury3DButton>
                            <Luxury3DButton size="sm" variant="ghost" onClick={() => { setEditingMessage(null); setEditContent(''); }}>
                              Cancel
                            </Luxury3DButton>
                          </div>
                        </div>
                      ) : (
                        <p className="text-white leading-relaxed">
                          {message.content}
                          {message.is_edited && (
                            <span className="text-xs text-white/50 ml-2">(edited)</span>
                          )}
                        </p>
                      )}
                    </LuxuryGlassCard>
                    
                    {/* Message Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Luxury3DButton
                          variant="ghost"
                          size="icon"
                          className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Luxury3DButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-white/20">
                        <DropdownMenuItem onClick={() => handleSaveMessage(message.id)} className="text-white hover:bg-white/10">
                          {savedMessages.has(message.id) ? (
                            <HeartOff className="h-4 w-4 mr-2 text-red-400" />
                          ) : (
                            <Heart className="h-4 w-4 mr-2 text-pink-400" />
                          )}
                          {savedMessages.has(message.id) ? 'Unsave' : 'Save'}
                        </DropdownMenuItem>
                        
                        {isOwn && isMessageEditable(message) && editingMessage !== message.id && (
                          <DropdownMenuItem onClick={() => { setEditingMessage(message.id); setEditContent(message.content); }} className="text-white hover:bg-white/10">
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        
                        {isOwn && isMessageDeletable(message) && (
                          <DropdownMenuItem onClick={() => handleDeleteMessage(message.id)} className="text-red-400 hover:bg-red-400/10">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <div className={`flex items-center gap-2 mt-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-white/60">{formatTime(message.created_at)}</span>
                      {isOwn && (
                        <div className="flex gap-1">
                          <div className={`w-1 h-1 rounded-full ${message.delivery_status === 'seen' ? 'bg-blue-400' : message.delivery_status === 'delivered' ? 'bg-white/60' : 'bg-white/40'}`} />
                          <div className={`w-1 h-1 rounded-full ${message.delivery_status === 'seen' ? 'bg-blue-400' : 'bg-white/40'}`} />
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <LuxuryGlassCard variant="secondary" className="px-4 py-3" glow={false}>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </LuxuryGlassCard>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Luxury Message Input */}
      <motion.div 
        className="flex-shrink-0 p-6 border-t border-white/10 bg-gradient-to-r from-black/40 via-slate-900/60 to-black/40 backdrop-blur-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-end gap-4">
          <Luxury3DButton variant="ghost" size="icon" onClick={() => setShowMediaDialog(true)}>
            <Paperclip className="h-5 w-5" />
          </Luxury3DButton>
          <Luxury3DButton variant="ghost" size="icon" onClick={handleCameraCapture}>
            <Camera className="h-5 w-5" />
          </Luxury3DButton>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Type a luxury message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-16 bg-gradient-to-r from-white/10 to-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400/50 rounded-2xl backdrop-blur-xl h-12"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            </div>
          </div>

          {newMessage.trim() ? (
            <Luxury3DButton onClick={sendMessage} disabled={sending} variant="primary">
              {sending ? (
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Luxury3DButton>
          ) : (
            <Luxury3DButton variant="ghost" size="icon" onClick={() => setShowVoiceDialog(true)}>
              <Mic className="h-5 w-5" />
            </Luxury3DButton>
          )}
        </div>
      </motion.div>

      {/* Dialogs */}
      <MediaUploadDialog 
        open={showMediaDialog}
        onOpenChange={setShowMediaDialog}
        onSendMedia={(url, type) => setShowMediaDialog(false)}
      />
      
      <VoiceRecorderDialog 
        open={showVoiceDialog}
        onOpenChange={setShowVoiceDialog}
        onSendVoice={(url) => setShowVoiceDialog(false)}
      />
      
      <CameraDialog 
        open={showCameraDialog}
        onOpenChange={setShowCameraDialog}
        onSendCapture={(captureUrl, type) => setShowCameraDialog(false)}
      />
      
      <BookingDialog 
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        recipientId={userProfile?.id}
        recipientName={userProfile?.username}
      />

      {showSnapCamera && (
        <SnapCamera
          onCapture={async (blob) => {
            try {
              const fileName = `snap_${Date.now()}.${blob.type.includes('video') ? 'webm' : 'jpg'}`;
              const { error: uploadError } = await supabase.storage.from('messages').upload(fileName, blob);
              if (uploadError) throw uploadError;

              const { data: { publicUrl } } = supabase.storage.from('messages').getPublicUrl(fileName);
              const expiresAt = new Date(Date.now() + 10 * 1000);
              const { error: messageError } = await supabase.from('direct_messages').insert({
                sender_id: user?.id,
                recipient_id: conversationId,
                media_url: [publicUrl],
                message_type: 'snap',
                expires_at: expiresAt.toISOString(),
                duration: blob.type.includes('video') ? 10 : undefined
              });

              if (messageError) throw messageError;
              toast({ title: "Snap sent!", description: "Your snap will disappear after viewing" });
              setShowSnapCamera(false);
            } catch (error) {
              console.error('Error sending snap:', error);
              toast({ title: "Failed to send snap", description: "Please try again", variant: "destructive" });
            }
          }}
          onClose={() => setShowSnapCamera(false)}
        />
      )}

      {showCallDialog && userProfile && (
        <CallDialog
          isOpen={showCallDialog}
          onClose={() => setShowCallDialog(false)}
          callType={callType}
          recipient={{
            id: conversationId,
            username: userProfile.username,
            avatar_url: userProfile.avatar_url
          }}
        />
      )}
    </div>
  );
};