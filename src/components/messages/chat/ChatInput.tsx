import { useState, useCallback } from 'react';
import { MessageInput } from '../MessageInput';
import { useChatActions } from './ChatActions'; // Changed from useChatActionsV2
import { DirectMessage } from '@/integrations/supabase/types/message';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { useMessageAudit } from '@/hooks/useMessageAudit';
import { useToast } from '@/hooks/use-toast';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onTyping: () => void;
  recipientId: string;
  onMessageSent?: () => void;
  onMessageError?: (error: string) => void;
}

export const ChatInput = ({ 
  onSendMessage, 
  onTyping, 
  recipientId,
  onMessageSent,
  onMessageError
}: ChatInputProps) => {
  const [replyTo, setReplyTo] = useState<DirectMessage | null>(null);
  const [isSending, setIsSending] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  
  const { 
    isUploading, 
    handleMediaSelect, 
    handleSnapCapture 
  } = useChatActions({ recipientId }); // Changed from useChatActionsV2

  const { logMessageActivity, logMediaUpload } = useMessageAudit(recipientId);
  const { sendTypingStatus } = useTypingIndicator(recipientId);

  // Enhanced send message handler
  const handleSendMessage = useCallback(async (content: string) => {
    if (!session?.user?.id || content.trim() === '') return;
    
    setIsSending(true);
    
    try {
      // Call the parent handler
      onSendMessage(content);
      
      // Log message activity
      logMessageActivity({
        recipient_id: recipientId,
        activity_type: 'send',
        details: { content_preview: content.substring(0, 50) },
        length: content.length
      });
      
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      
      if (onMessageError) {
        onMessageError(error.message || "Failed to send message");
      }
    } finally {
      setIsSending(false);
    }
  }, [session?.user?.id, recipientId, onSendMessage, logMessageActivity, toast, onMessageSent, onMessageError]);

  const handleTyping = useCallback(() => {
    sendTypingStatus(true);
    onTyping();
  }, [sendTypingStatus, onTyping]);

  const handleSendVoiceMessage = async (audioBlob: Blob) => {
    if (!session?.user?.id) return;
    
    setIsSending(true);
    
    try {
      // Create a file from the blob
      const file = new File([audioBlob], `voice-message-${Date.now()}.webm`, {
        type: 'audio/webm',
      });
      
      // Upload audio file
      const fileName = `${crypto.randomUUID()}.webm`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('messages')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('messages')
        .getPublicUrl(fileName);
      
      // Insert message with audio URL
      await supabase.from('direct_messages').insert({
        sender_id: session.user.id,
        recipient_id: recipientId,
        media_url: [publicUrl],
        message_type: 'audio',
        reply_to_id: replyTo?.id,
        created_at: new Date().toISOString(),
      });
      
      // Log the activity
      logMediaUpload({
        recipient_id: recipientId, 
        file_count: 1, 
        file_types: ['audio/webm'],
        size_bytes: file.size
      });
      
      // Clear reply
      setReplyTo(null);
      
      if (onMessageSent) {
        onMessageSent();
      }
      
      toast({
        title: "Voice message sent",
        description: "Your voice message has been sent successfully"
      });
    } catch (error: any) {
      console.error('Error sending voice message:', error);
      
      toast({
        title: "Failed to send voice message",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      
      if (onMessageError) {
        onMessageError(error.message || "Failed to send voice message");
      }
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <MessageInput
      onSendMessage={handleSendMessage}
      onMediaSelect={() => {
        // Create an input element to trigger file selection
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*,video/*';
        input.onchange = (e) => {
          const files = (e.target as HTMLInputElement).files;
          if (files && files.length > 0) {
            handleMediaSelect(files);
          }
        };
        input.click();
      }}
      onSnapStart={() => {
        // In a real implementation, this would likely trigger a camera UI
        // For now we're just implementing the interface correctly
        const dummyDataUrl = 'data:image/png;base64,dummy';
        handleSnapCapture(dummyDataUrl);
      }}
      onVoiceMessage={handleSendVoiceMessage}
      isLoading={isUploading || isSending}
      recipientId={recipientId}
      replyToMessage={replyTo}
      onReplyCancel={() => setReplyTo(null)}
      onTyping={handleTyping}
    />
  );
};
