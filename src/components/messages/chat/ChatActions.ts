
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DirectMessage } from '@/integrations/supabase/types/message';

interface UseChatActionsProps {
  recipientId: string;
}

export const useChatActions = ({ recipientId }: UseChatActionsProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content,
          message_type: 'text'
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  };

  const resendMessage = async (message: DirectMessage) => {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .update({ content: message.content })
        .eq('id', message.id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error resending message:', error);
      return { success: false, error: error.message };
    }
  };

  const handleMediaSelect = async (file: File) => {
    setIsUploading(true);
    try {
      // Implementation for media upload would go here
      console.log('Media selected:', file.name);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSnapCapture = async (imageData: string) => {
    setIsUploading(true);
    try {
      // Implementation for snap capture would go here
      console.log('Snap captured');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    handleSendMessage,
    resendMessage,
    isUploading,
    handleMediaSelect,
    handleSnapCapture
  };
};
