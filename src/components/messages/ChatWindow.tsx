
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { useEnhancedRealtime } from "@/hooks/useEnhancedRealtime";
import { MessageInput } from "./MessageInput";
import { ChatMessageList } from "./chat/ChatMessageList";
import { useChatActionsV2 } from "@/hooks/useChatActionsV2";
import { SnapCaptureModal } from "./chat/SnapCaptureModal";
import { ChatHeader } from "./chat/ChatHeader"; 
import { BookingDialog } from "./booking/BookingDialog";
import { CallDialog } from "./calls/CallDialog"; // We'll create this later

interface ChatWindowProps {
  recipient: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  onClose: () => void;
  onToggleDetails: () => void;
  onSendSuccess?: () => void;
}

export const ChatWindow = ({ 
  recipient, 
  onClose,
  onToggleDetails,
  onSendSuccess 
}: ChatWindowProps) => {
  const [showSnapModal, setShowSnapModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('video');
  const [bookingType, setBookingType] = useState<'chat' | 'video' | 'voice'>('video');
  const [replyToMessage, setReplyToMessage] = useState<DirectMessage | null>(null);
  const session = useSession();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUserId = session?.user?.id;
  
  // Use our enhanced realtime system
  const { 
    isTyping, 
    sendTypingStatus, 
    markAsRead, 
    markAllAsRead,
    userPresence 
  } = useEnhancedRealtime(recipient?.id);

  // Use our enhanced chat actions
  const { 
    isUploading, 
    handleSendMessage, 
    handleMediaSelect, 
    handleSnapCapture,
    resendMessage
  } = useChatActionsV2({ recipientId: recipient?.id });

  // Fetch messages from direct_messages table
  const { 
    data: messages = [],
    isLoading
  } = useQuery({
    queryKey: ["chat", currentUserId, recipient?.id],
    queryFn: async () => {
      if (!recipient?.id || !currentUserId) return [];

      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${recipient.id}),and(sender_id.eq.${recipient.id},recipient_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return [];
      }

      return data as DirectMessage[];
    },
    enabled: !!recipient?.id && !!currentUserId
  });

  // Mark messages as read when they come into view
  useEffect(() => {
    if (messages.length > 0 && currentUserId) {
      // Find messages from recipient that aren't marked as read
      const unreadMessages = messages.filter(
        msg => msg.sender_id === recipient.id && 
              (!msg.viewed_at || msg.delivery_status !== 'seen')
      );
      
      if (unreadMessages.length > 0) {
        // Mark all as read
        markAllAsRead();
      }
    }
  }, [messages, currentUserId, recipient.id, markAllAsRead]);

  // Send typing indicator when user is typing
  const handleSendWithTypingIndicator = (content: string) => {
    handleSendMessage(content);
    sendTypingStatus(false);
    if (onSendSuccess) onSendSuccess();
  };

  // Track typing status and send to recipient
  const handleTyping = () => {
    sendTypingStatus(true);
  };

  const handleOpenFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    await handleMediaSelect(files);
    
    // Reset file input
    if (event.target) {
      event.target.value = "";
    }
    
    if (onSendSuccess) onSendSuccess();
  };

  const handleOpenSnapCapture = () => {
    setShowSnapModal(true);
  };

  const handleSnapSubmit = async (dataUrl: string) => {
    await handleSnapCapture(dataUrl);
    setShowSnapModal(false);
    if (onSendSuccess) onSendSuccess();
  };

  const handleOpenBookingDialog = (type: 'chat' | 'video' | 'voice') => {
    setBookingType(type);
    setShowBookingModal(true);
  };

  const handleSendVoiceMessage = async (audioBlob: Blob) => {
    // Create a File object from the Blob
    const file = new File([audioBlob], `voice-message-${Date.now()}.webm`, { type: 'audio/webm' });
    
    // Create a FileList-like object
    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => file
    };
    
    // Use the existing media handler
    await handleMediaSelect(fileList as unknown as FileList);
    if (onSendSuccess) onSendSuccess();
  };

  // Initialize direct call
  const handleInitiateCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setShowCallDialog(true);
  };

  const recipientOnlineStatus = recipient.id ? userPresence[recipient.id] : undefined;
  
  const recipientProfile = {
    username: recipient?.username,
    avatar_url: recipient?.avatar_url,
    online_status: recipientOnlineStatus
  };

  if (!currentUserId || !recipient?.id) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-luxury-neutral/60">Unable to load chat</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-luxury-dark to-black/95">
      {/* Chat Header with recipient info */}
      <ChatHeader 
        recipientProfile={recipientProfile}
        recipientId={recipient.id}
        onVoiceCall={() => handleInitiateCall('audio')}
        onVideoCall={() => handleInitiateCall('video')}
        onToggleDetails={onToggleDetails}
        isTyping={isTyping}
        onBack={onClose}
      />

      {/* Messages list */}
      <ChatMessageList 
        messages={messages}
        currentUserId={currentUserId}
        recipientProfile={recipientProfile}
        isTyping={isTyping}
        onRetry={resendMessage}
      />

      {/* Message input area */}
      <div className="p-2 border-t border-luxury-neutral/20">
        <MessageInput
          onSendMessage={handleSendWithTypingIndicator}
          onMediaSelect={handleOpenFileInput}
          onSnapStart={handleOpenSnapCapture}
          onVoiceMessage={handleSendVoiceMessage}
          onBookCall={() => handleOpenBookingDialog('chat')}
          isLoading={isUploading}
          recipientId={recipient.id}
          replyToMessage={replyToMessage}
          onReplyCancel={() => setReplyToMessage(null)}
          onTyping={handleTyping}
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
          multiple
          accept="image/*,video/*,audio/*,application/pdf,application/msword"
        />
      </div>

      {/* Snap capture modal */}
      {showSnapModal && (
        <SnapCaptureModal 
          open={showSnapModal}
          onClose={() => setShowSnapModal(false)}
          onSubmit={handleSnapSubmit}
        />
      )}

      {/* Booking dialog */}
      <BookingDialog
        creatorId={recipient.id}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        bookingType={bookingType}
      />
      
      {/* Call dialog */}
      {showCallDialog && (
        <CallDialog
          isOpen={showCallDialog}
          onClose={() => setShowCallDialog(false)}
          callType={callType}
          recipient={recipient}
        />
      )}
    </div>
  );
};

export default ChatWindow;
