import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Info, Send, Phone, Video, MoreVertical, Paperclip, Smile, Camera, Zap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Luxury3DButton } from '@/components/ui/luxury-3d-button';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CallDialog } from './calls/CallDialog';
import { CameraDialog } from './CameraDialog';
import { SnapCamera } from './chat/SnapCamera';
import { MessageBubbleContent } from './message-parts/MessageBubbleContent';
import { useVideoRecording } from './useVideoRecording';
import { EmojiPicker, transformTextToEmoji } from './chat/EmojiPicker';
import { AttachmentButton } from './message-parts/AttachmentButton';
import { MediaPreviewInChat } from './chat/MediaPreviewInChat';

interface PendingAttachment {
  id: string;
  blob: Blob;
  type: 'snax' | 'media';
  duration?: number;
  preview?: string;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  message_type?: 'text' | 'image' | 'video' | 'audio' | 'file';
}

interface ChatAreaProps {
  conversationId: string;
  onShowDetails: () => void;
}

export const SimpleOptimizedChatArea = memo(({ conversationId, onShowDetails }: ChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const [showSnapCamera, setShowSnapCamera] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Video recording hook
  const { isRecording, startRecording, stopRecording } = useVideoRecording(
    conversationId,
    () => fetchMessages()
  );

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!conversationId || !user?.id) return;

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
  }, [conversationId, user?.id]);

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    if (!conversationId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, [conversationId]);

  // Send message
  const sendMessage = useCallback(async () => {
    if ((!newMessage.trim() && pendingAttachments.length === 0) || !user?.id || sending) return;

    setSending(true);
    try {
      // Send text message if present
      if (newMessage.trim()) {
        // Transform text shortcuts to emojis before sending
        const transformedMessage = transformTextToEmoji(newMessage.trim());
        
        const { error } = await supabase
          .from('direct_messages')
          .insert({
            content: transformedMessage,
            sender_id: user.id,
            recipient_id: conversationId,
            message_type: 'text'
          });

        if (error) throw error;
      }

      // Process pending attachments
      for (const attachment of pendingAttachments) {
        const fileName = `${crypto.randomUUID()}.${attachment.blob.type.includes('video') ? 'webm' : attachment.blob.type.includes('image') ? 'jpg' : 'bin'}`;
        
        const { error: uploadError } = await supabase.storage
          .from('messages')
          .upload(fileName, attachment.blob);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('messages')
          .getPublicUrl(fileName);

        // Handle Snax messages (disappearing)
        if (attachment.type === 'snax') {
          const expiresAt = new Date();
          expiresAt.setSeconds(expiresAt.getSeconds() + (attachment.duration || 10));

          const { error } = await supabase
            .from('direct_messages')
            .insert({
              content: publicUrl,
              sender_id: user.id,
              recipient_id: conversationId,
              message_type: attachment.blob.type.includes('video') ? 'video' : 'image',
              message_source: 'snap',
              duration: attachment.duration,
              expires_at: expiresAt.toISOString()
            });

          if (error) throw error;
        } else {
          // Handle regular media
          const messageType = attachment.blob.type.includes('video') ? 'video' : 
                             attachment.blob.type.includes('image') ? 'image' : 'file';

          const { error } = await supabase
            .from('direct_messages')
            .insert({
              content: publicUrl,
              sender_id: user.id,
              recipient_id: conversationId,
              message_type: messageType
            });

          if (error) throw error;
        }
      }
      
      setNewMessage('');
      setPendingAttachments([]);
      await fetchMessages();
      
      if (pendingAttachments.some(a => a.type === 'snax')) {
        toast({
          title: "Snax sent!",
          description: "Your disappearing media has been sent"
        });
      } else if (pendingAttachments.length > 0) {
        toast({
          title: "Media sent!",
          description: "Your media has been sent successfully"
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  }, [newMessage, user?.id, conversationId, sending, fetchMessages, toast, pendingAttachments, setPendingAttachments]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Handle real-time messages
  useEffect(() => {
    if (!user?.id || !conversationId) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `or(and(sender_id.eq.${user.id},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${user.id}))`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, conversationId, fetchMessages]);

  useEffect(() => {
    fetchMessages();
    fetchUserProfile();
  }, [fetchMessages, fetchUserProfile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Call handlers
  const handleAudioCall = () => {
    setCallType('audio');
    setShowCallDialog(true);
  };

  const handleVideoCall = () => {
    setCallType('video'); 
    setShowCallDialog(true);
  };

  // File upload handler
  const handleFileUpload = async (files: FileList) => {
    if (!files.length || !user?.id) return;

    const file = files[0];
    const fileName = `${crypto.randomUUID()}-${file.name}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('messages')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('messages')
        .getPublicUrl(fileName);

      const messageType = file.type.startsWith('image/') ? 'image' : 
                         file.type.startsWith('video/') ? 'video' : 'file';

      const { error } = await supabase
        .from('direct_messages')
        .insert({
          content: publicUrl,
          sender_id: user.id,
          recipient_id: conversationId,
          message_type: messageType
        });

      if (error) throw error;
      
      await fetchMessages();
      toast({
        title: "File sent!",
        description: "Your file has been sent successfully"
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to send file",
        variant: "destructive"
      });
    }
  };

  // Camera capture handler
  const handleCameraCapture = (captureUrl: string, type: 'photo' | 'video') => {
    // Handle the captured media
    console.log('Captured:', type, captureUrl);
    setShowCameraDialog(false);
  };

  // Snap camera handler  
  const handleSnapCapture = async (blob: Blob) => {
    try {
      const fileName = `${crypto.randomUUID()}.${blob.type.includes('video') ? 'webm' : 'jpg'}`;
      const { error: uploadError } = await supabase.storage
        .from('messages')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('messages')
        .getPublicUrl(fileName);

      // Set expiration for snaps (24 hours)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error } = await supabase
        .from('direct_messages')
        .insert({
          content: publicUrl,
          sender_id: user.id,
          recipient_id: conversationId,
          message_type: blob.type.includes('video') ? 'video' : 'image',
          message_source: 'snap',
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;
      
      await fetchMessages();
      toast({
        title: "Snap sent!",
        description: "Your snap will disappear after viewing"
      });
    } catch (error) {
      console.error('Error sending snap:', error);
      toast({
        title: "Error", 
        description: "Failed to send snap",
        variant: "destructive"
      });
    }
  };

  // Emoji selection handler
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Media selection handler for sophisticated attachment workflow
  const handleMediaSelect = useCallback((blob: Blob, type: 'snax' | 'media', duration?: number) => {
    const preview = URL.createObjectURL(blob);
    const attachment: PendingAttachment = {
      id: crypto.randomUUID(),
      blob,
      type,
      duration,
      preview
    };
    setPendingAttachments(prev => [...prev, attachment]);
  }, []);

  // Simulate typing indicator
  useEffect(() => {
    if (messages.length > 0) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-64 max-h-64 min-h-64">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userProfile?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
              {userProfile?.username?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white font-semibold">
              {userProfile?.username || 'Unknown User'}
            </h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-white/60 text-sm">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white"
            onClick={handleAudioCall}
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white"
            onClick={handleVideoCall}
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowDetails}
            className="text-white/70 hover:text-white"
          >
            <Info className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/80 border-white/20">
              <DropdownMenuItem className="text-white">Archive Chat</DropdownMenuItem>
              <DropdownMenuItem className="text-white">Clear History</DropdownMenuItem>
              <DropdownMenuItem className="text-red-400">Block User</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-white text-lg font-semibold mb-2">Start Conversation</h3>
              <p className="text-white/60 text-sm">Send your first message to begin chatting</p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender_id === user?.id;
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                  {!isOwn && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={userProfile?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs">
                        {userProfile?.username?.[0]?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                   <div
                     className={`px-4 py-3 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                       isOwn
                         ? 'bg-white/95 text-gray-900 rounded-br-md shadow-lg border border-white/20'
                         : 'bg-gray-900/80 text-white border border-gray-700/50 rounded-bl-md shadow-xl'
                     }`}
                     style={{
                       backdropFilter: 'blur(20px)',
                       boxShadow: isOwn 
                         ? '0 8px 32px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                         : '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                     }}
                   >
                     {/* Render message content based on type */}
                     {message.message_type === 'text' || !message.message_type ? (
                       <p className="break-words">{message.content}</p>
                     ) : message.message_type === 'image' ? (
                       <div className="space-y-2">
                         <img 
                           src={message.content} 
                           alt="Image"
                           className="max-w-[200px] max-h-[200px] object-cover rounded-md"
                         />
                       </div>
                     ) : message.message_type === 'video' ? (
                       <div className="space-y-2">
                         <video 
                           controls 
                           className="max-w-[200px] max-h-[200px] object-cover rounded-md"
                         >
                           <source src={message.content} />
                         </video>
                       </div>
                     ) : (
                       <p className="break-words">{message.content}</p>
                     )}
                     
                     <p className={`text-xs mt-2 ${isOwn ? 'text-gray-600' : 'text-gray-400'}`}>
                       {new Date(message.created_at).toLocaleTimeString([], {
                         hour: '2-digit',
                         minute: '2-digit'
                       })}
                     </p>
                   </div>
                </div>
              </motion.div>
            );
          })
        )}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={userProfile?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs">
                  {userProfile?.username?.[0]?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="bg-white/10 px-4 py-2 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-auto p-4 border-t border-white/10 bg-background/95 backdrop-blur-sm">
        {/* Media Preview Section */}
        {pendingAttachments.length > 0 && (
          <div className="mb-4 space-y-2">
            {pendingAttachments.map((attachment, index) => (
              <MediaPreviewInChat 
                key={attachment.id}
                mediaBlob={attachment.blob}
                mediaType={attachment.type}
                duration={attachment.duration}
                onRemove={() => {
                  setPendingAttachments(prev => prev.filter((_, i) => i !== index));
                }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center space-x-3">
          <AttachmentButton 
            onImageSelect={() => {/* Handled by MediaAttachmentHub */}}
            onDocumentSelect={() => {/* Handled by MediaAttachmentHub */}}
            onMediaSelect={handleMediaSelect}
          />

          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => {
                const value = e.target.value;
                // Transform common text shortcuts to emojis as user types
                const transformedValue = transformTextToEmoji(value);
                setNewMessage(transformedValue);
              }}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Type your message..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12"
              disabled={sending}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            </div>
          </div>
          
          <Luxury3DButton
            variant="primary"
            size="sm"
            onClick={sendMessage}
            disabled={(!newMessage.trim() && pendingAttachments.length === 0) || sending}
            className="min-w-[44px]"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Luxury3DButton>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
      />

      {/* Call Dialog */}
      {showCallDialog && userProfile && (
        <CallDialog
          isOpen={showCallDialog}
          onClose={() => setShowCallDialog(false)}
          callType={callType}
          recipient={{
            id: conversationId,
            username: userProfile.username || 'Unknown User',
            avatar_url: userProfile.avatar_url
          }}
        />
      )}

      {/* Camera Dialog */}
      <CameraDialog
        open={showCameraDialog}
        onOpenChange={setShowCameraDialog}
        onSendCapture={handleCameraCapture}
      />

      {/* Snap Camera */}
      {showSnapCamera && (
        <SnapCamera
          onCapture={handleSnapCapture}
          onClose={() => setShowSnapCamera(false)}
        />
      )}
    </div>
  );
});

SimpleOptimizedChatArea.displayName = 'SimpleOptimizedChatArea';