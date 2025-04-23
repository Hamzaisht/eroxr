
import { useState } from 'react';
import { MessageInput } from '../MessageInput';
import { useChatActions } from './ChatActions';
import { DirectMessage } from '@/integrations/supabase/types/message';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onTyping: () => void;
  recipientId: string;
}

export const ChatInput = ({ onSendMessage, onTyping, recipientId }: ChatInputProps) => {
  const [replyTo, setReplyTo] = useState<DirectMessage | null>(null);
  const session = useSession();
  
  const { 
    isUploading, 
    handleMediaSelect, 
    handleSnapCapture 
  } = useChatActions({ recipientId });

  const handleSendVoiceMessage = async (audioBlob: Blob) => {
    if (!session?.user?.id) return;
    
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
      
      // Clear reply
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending voice message:', error);
    }
  };

  return (
    <MessageInput
      onSendMessage={onSendMessage}
      onMediaSelect={handleMediaSelect}
      onSnapStart={handleSnapCapture}
      onVoiceMessage={handleSendVoiceMessage}
      isLoading={isUploading}
      recipientId={recipientId}
      replyToMessage={replyTo}
      onReplyCancel={() => setReplyTo(null)}
    />
  );
};
