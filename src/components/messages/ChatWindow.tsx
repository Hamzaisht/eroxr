
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { MessageInput } from './MessageInput';

interface ChatWindowProps {
  recipient: {
    id: string;
    username: string;
    avatar_url: string | null;
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
  const [messagesEnd, setMessagesEnd] = useState<HTMLElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const currentUserId = session?.user?.id;
  const recipientId = recipient?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use our realtime messages hook for subscriptions
  useRealtimeMessages(recipientId);

  const scrollToBottom = () => {
    messagesEnd?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  // Fetch messages from direct_messages table
  const { 
    data: messages,
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ["chat", currentUserId, recipientId],
    queryFn: async () => {
      if (!recipientId || !currentUserId) return [];

      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return [];
      }

      return data as DirectMessage[];
    },
    enabled: !!recipientId && !!currentUserId
  });

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !currentUserId || !recipientId) return;

    const newMessage = {
      id: uuidv4(),
      sender_id: currentUserId,
      recipient_id: recipientId,
      content: content.trim(),
      message_type: 'text',
      created_at: new Date().toISOString(),
      delivery_status: 'sent'
    };

    try {
      const { error } = await supabase
        .from('direct_messages')
        .insert([newMessage]);

      if (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error sending message",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }

      await refetch();
      scrollToBottom();
      onSendSuccess?.();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMediaSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !currentUserId || !recipientId) return;

    const fileArray = Array.from(files);
    const mediaUrls: string[] = [];

    // Show loading toast
    toast({
      title: "Uploading files",
      description: "Please wait while we upload your files.",
    });

    try {
      // Upload each file to storage
      for (const file of fileArray) {
        const fileName = `${uuidv4()}_${file.name}`;
        const filePath = `${currentUserId}/${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('messages')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('messages')
          .getPublicUrl(filePath);
          
        mediaUrls.push(publicUrl);
      }

      // Create message with media
      const messageType = fileArray[0].type.startsWith('image/') ? 'media' : 
                         fileArray[0].type.startsWith('video/') ? 'video' : 'document';

      const newMessage = {
        id: uuidv4(),
        sender_id: currentUserId,
        recipient_id: recipientId,
        media_url: mediaUrls,
        message_type: messageType,
        created_at: new Date().toISOString(),
        delivery_status: 'sent'
      };

      const { error } = await supabase
        .from('direct_messages')
        .insert([newMessage]);

      if (error) throw error;

      // Success toast
      toast({
        title: "Media sent",
        description: "Your media files have been sent.",
      });

      await refetch();
      scrollToBottom();
      onSendSuccess?.();

    } catch (error: any) {
      console.error("Error sending media:", error);
      toast({
        title: "Failed to send media",
        description: error.message || "An error occurred while sending media.",
        variant: "destructive",
      });
    }

    // Reset file input
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleSnapCapture = async (dataUrl: string) => {
    if (!currentUserId || !recipientId) return;

    try {
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `snap_${Date.now()}.png`, { type: 'image/png' });
      
      // Upload to storage
      const filePath = `${currentUserId}/${uuidv4()}_snap.png`;
      
      const { error: uploadError } = await supabase.storage
        .from('messages')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('messages')
        .getPublicUrl(filePath);

      // Create snap message
      const snapMessage = {
        id: uuidv4(),
        sender_id: currentUserId,
        recipient_id: recipientId,
        media_url: [publicUrl],
        message_type: 'snap',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        created_at: new Date().toISOString(),
        delivery_status: 'sent'
      };

      const { error } = await supabase
        .from('direct_messages')
        .insert([snapMessage]);

      if (error) throw error;

      toast({
        title: "Snap sent",
        description: "Your snap has been sent and will expire in 24 hours.",
      });

      await refetch();
      scrollToBottom();
      
    } catch (error: any) {
      toast({
        title: "Failed to send snap",
        description: error.message || "An error occurred while sending your snap.",
        variant: "destructive",
      });
    }
  };

  const handleVoiceMessage = async (audioBlob: Blob) => {
    if (!currentUserId || !recipientId) return;
    
    try {
      // Create a file from the blob
      const file = new File([audioBlob], `voice-message-${Date.now()}.webm`, {
        type: 'audio/webm',
      });
      
      // Upload audio file
      const fileName = `${uuidv4()}.webm`;
      const filePath = `${currentUserId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('messages')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('messages')
        .getPublicUrl(filePath);
      
      // Insert message with audio URL
      const { error } = await supabase.from('direct_messages').insert({
        id: uuidv4(),
        sender_id: currentUserId,
        recipient_id: recipientId,
        media_url: [publicUrl],
        message_type: 'audio',
        created_at: new Date().toISOString(),
        delivery_status: 'sent'
      });
      
      if (error) throw error;

      toast({
        title: "Voice message sent",
        description: "Your voice message has been sent.",
      });

      await refetch();
      scrollToBottom();
      
    } catch (error: any) {
      console.error('Error sending voice message:', error);
      toast({
        title: "Failed to send voice message",
        description: error.message || "An error occurred while sending your voice message.",
        variant: "destructive",
      });
    }
  };

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

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-6 w-6 border-2 border-luxury-primary border-t-transparent rounded-full"></div>
            </div>
          ) : messages && messages.length === 0 ? (
            <div className="text-center text-luxury-neutral/60 py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages?.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.sender_id === currentUserId ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`rounded-lg px-3 py-2 text-sm ${message.sender_id === currentUserId
                    ? 'bg-luxury-primary text-white'
                    : 'bg-luxury-darker text-luxury-neutral'
                    }`}
                >
                  {message.content}
                </div>
                <span className="text-xs text-luxury-neutral/60 mt-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
          <div
            style={{ float: "left", clear: "both" }}
            ref={(el) => { setMessagesEnd(el); }}
          >
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-luxury-neutral/20">
        <MessageInput
          onSendMessage={handleSendMessage}
          onMediaSelect={handleMediaSelect}
          onSnapStart={() => handleSnapCapture('data:image/png;base64,dummy')} // This would be replaced with actual camera capture
          onVoiceMessage={handleVoiceMessage}
          isLoading={false}
          recipientId={recipientId}
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
    </div>
  );
};

export default ChatWindow;
