import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
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

// Memoized Message Component
const MessageItem = memo(({ message, isOwn, userProfile, onEdit, onDelete, onSave, isEditing, editContent, setEditContent, onEditSave, onEditCancel, isSaved }: {
  message: Message;
  isOwn: boolean;
  userProfile: any;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onSave: (id: string) => void;
  isEditing: boolean;
  editContent: string;
  setEditContent: (content: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  isSaved: boolean;
}) => {
  const formatTime = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, []);

  const isMessageEditable = useCallback((message: Message): boolean => {
    const messageAge = new Date().getTime() - new Date(message.created_at).getTime();
    const twoHours = 2 * 60 * 60 * 1000;
    return messageAge < twoHours && message.delivery_status !== 'seen';
  }, []);

  const isMessageDeletable = useCallback((message: Message): boolean => {
    const messageAge = new Date().getTime() - new Date(message.created_at).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return messageAge < twentyFourHours;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-sm lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {!isOwn && (
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-8 w-8 border border-white/20">
              <AvatarImage src={userProfile?.avatar_url} />
              <AvatarFallback className="text-xs bg-gradient-to-br from-purple-500/30 to-cyan-500/30 text-white">
                {userProfile?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/70 font-medium">{userProfile?.username}</span>
          </div>
        )}
        
        <div className="relative group">
          <LuxuryGlassCard
            variant={isOwn ? "primary" : "secondary"}
            className={`px-6 py-4 ${isOwn ? 'rounded-br-lg' : 'rounded-bl-lg'}`}
            glow={false}
          >
            {isEditing ? (
              <div>
                <Input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onEditSave();
                    } else if (e.key === 'Escape') {
                      onEditCancel();
                    }
                  }}
                  className="bg-transparent border-white/30 text-white"
                  autoFocus
                />
                <div className="flex gap-2 mt-3">
                  <Luxury3DButton size="sm" onClick={onEditSave} variant="primary">
                    Save
                  </Luxury3DButton>
                  <Luxury3DButton size="sm" variant="ghost" onClick={onEditCancel}>
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
              <DropdownMenuItem onClick={() => onSave(message.id)} className="text-white hover:bg-white/10">
                {isSaved ? (
                  <HeartOff className="h-4 w-4 mr-2 text-red-400" />
                ) : (
                  <Heart className="h-4 w-4 mr-2 text-pink-400" />
                )}
                {isSaved ? 'Unsave' : 'Save'}
              </DropdownMenuItem>
              
              {isOwn && isMessageEditable(message) && !isEditing && (
                <DropdownMenuItem onClick={() => onEdit(message.id, message.content)} className="text-white hover:bg-white/10">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              
              {isOwn && isMessageDeletable(message) && (
                <DropdownMenuItem onClick={() => onDelete(message.id)} className="text-red-400 hover:bg-red-400/10">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className={`flex items-center gap-2 mt-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-white/60">{formatTime(message.created_at)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

MessageItem.displayName = 'MessageItem';

export const OptimizedChatArea = memo(({ conversationId, onShowDetails }: ChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [savedMessages, setSavedMessages] = useState<Set<string>>(new Set());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Enable disappearing messages cleanup
  useDisappearingMessages();

  // Memoized callbacks
  const handleSelectConversation = useCallback((id: string | null) => {
    // Handle conversation selection
  }, []);

  const handleSaveMessage = useCallback(async (messageId: string) => {
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
  }, [savedMessages, toast]);

  const handleEditMessage = useCallback(async (messageId: string) => {
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
  }, [editContent, messages, toast]);

  const handleDeleteMessage = useCallback(async (messageId: string) => {
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
  }, [toast]);

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || sending || !user?.id) return;

    setSending(true);
    const messageContent = newMessage;
    setNewMessage('');

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
  }, [newMessage, sending, user?.id, conversationId, toast]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Memoized scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

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

  // Real-time message subscription with better performance
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
  }, [messages, scrollToBottom]);

  // Memoized messages list
  const messagesList = useMemo(() => 
    messages.map((message) => {
      const isOwn = message.sender_id === user?.id;
      
      return (
        <MessageItem
          key={message.id}
          message={message}
          isOwn={isOwn}
          userProfile={userProfile}
          onEdit={(id, content) => {
            setEditingMessage(id);
            setEditContent(content);
          }}
          onDelete={handleDeleteMessage}
          onSave={handleSaveMessage}
          isEditing={editingMessage === message.id}
          editContent={editContent}
          setEditContent={setEditContent}
          onEditSave={() => handleEditMessage(message.id)}
          onEditCancel={() => {
            setEditingMessage(null);
            setEditContent('');
          }}
          isSaved={savedMessages.has(message.id)}
        />
      );
    }), [messages, user?.id, userProfile, editingMessage, editContent, savedMessages, handleDeleteMessage, handleSaveMessage, handleEditMessage]);

  return (
    <div className="flex flex-col h-full">
      {/* Optimized Chat Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/10 bg-gradient-to-r from-black/40 via-slate-900/60 to-black/40 backdrop-blur-xl">
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
            <Luxury3DButton variant="ghost" size="icon" onClick={() => {}}>
              <Calendar className="h-5 w-5" />
            </Luxury3DButton>
            <Luxury3DButton variant="ghost" size="icon" onClick={() => {}}>
              <Phone className="h-5 w-5" />
            </Luxury3DButton>
            <Luxury3DButton variant="ghost" size="icon" onClick={() => {}}>
              <Video className="h-5 w-5" />
            </Luxury3DButton>
            <Luxury3DButton variant="ghost" size="icon" onClick={onShowDetails}>
              <Info className="h-5 w-5" />
            </Luxury3DButton>
          </div>
        </div>
      </div>

      {/* Optimized Messages Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 fade-scrollbar">
        <AnimatePresence>
          {messagesList}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Optimized Input Area */}
      <div className="flex-shrink-0 p-6 border-t border-white/10 bg-gradient-to-r from-black/40 via-slate-900/60 to-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400/50 focus:ring-purple-400/20"
          />
          <Luxury3DButton 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || sending}
            variant="primary"
            size="icon"
          >
            <Send className="h-5 w-5" />
          </Luxury3DButton>
        </div>
      </div>
    </div>
  );
});

OptimizedChatArea.displayName = 'OptimizedChatArea';