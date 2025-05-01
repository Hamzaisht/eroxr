
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { MessageInput } from "./MessageInput";
import { ChatMessageList } from "./chat/ChatMessageList";
import { useChatActions } from "./chat/ChatActions";
import { SnapCaptureModal } from "./chat/SnapCaptureModal";
import { ChatHeader } from "./chat/ChatHeader"; 
import { useTypingIndicator } from "@/hooks/useTypingIndicator";

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
  const [replyToMessage, setReplyToMessage] = useState<DirectMessage | null>(null);
  const session = useSession();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUserId = session?.user?.id;
  const { isTyping, setIsTyping, sendTypingStatus } = useTypingIndicator(recipient?.id);

  // Use our realtime messages hook for subscriptions
  useRealtimeMessages(recipient?.id);

  const { 
    isUploading, 
    handleSendMessage, 
    handleMediaSelect, 
    handleSnapCapture 
  } = useChatActions({ recipientId: recipient?.id });

  // Fetch messages from direct_messages table
  const { 
    data: messages = [],
    isLoading,
    refetch 
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

  // Send typing indicator when user is typing
  const handleSendWithTypingIndicator = (content: string) => {
    handleSendMessage(content);
    sendTypingStatus(false);
  };

  // Track typing status and send to recipient
  const handleTyping = () => {
    setIsTyping(true);
    sendTypingStatus(true);
    
    // Automatically reset typing status after a few seconds
    setTimeout(() => {
      setIsTyping(false);
      sendTypingStatus(false);
    }, 5000);
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
  };

  const handleOpenSnapCapture = () => {
    setShowSnapModal(true);
  };

  const handleSnapSubmit = async (dataUrl: string) => {
    await handleSnapCapture(dataUrl);
    setShowSnapModal(false);
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
  };

  // Send voice or video call request
  const handleVoiceCall = () => {
    toast({
      title: "Coming Soon",
      description: "Voice calls will be available in a future update!"
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "Coming Soon", 
      description: "Video calls will be available in a future update!"
    });
  };

  const recipientProfile = {
    username: recipient?.username,
    avatar_url: recipient?.avatar_url
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
        onVoiceCall={handleVoiceCall}
        onVideoCall={handleVideoCall}
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
      />

      {/* Message input area */}
      <div className="p-2 border-t border-luxury-neutral/20">
        <MessageInput
          onSendMessage={handleSendWithTypingIndicator}
          onMediaSelect={handleOpenFileInput}
          onSnapStart={handleOpenSnapCapture}
          onVoiceMessage={handleSendVoiceMessage}
          isLoading={isUploading}
          recipientId={recipient.id}
          replyToMessage={replyToMessage}
          onReplyCancel={() => setReplyToMessage(null)}
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
    </div>
  );
};

export default ChatWindow;
