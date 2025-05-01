
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
  const [isTyping, setIsTyping] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<DirectMessage | null>(null);
  const session = useSession();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUserId = session?.user?.id;

  // Use our realtime messages hook for subscriptions
  useRealtimeMessages(recipient?.id);

  const { 
    isUploading, 
    handleSendMessage, 
    handleMediaSelect, 
    handleSnapCapture 
  } = useChatActions({ recipientId: recipient?.id });

  // Set up typing indicator timer
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

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
    <div className="flex flex-col h-full">
      <div className="border-b border-luxury-neutral/20 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={recipient?.avatar_url || ""} alt={recipient?.username || "User"} />
            <AvatarFallback>{recipient?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{recipient?.username}</div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={onToggleDetails}>
            Details
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <ChatMessageList 
        messages={messages}
        currentUserId={currentUserId}
        recipientProfile={recipientProfile}
        isTyping={isTyping}
      />

      <div className="p-4 border-t border-luxury-neutral/20">
        <MessageInput
          onSendMessage={handleSendMessage}
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
