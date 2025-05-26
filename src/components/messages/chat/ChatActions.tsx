
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DirectMessage } from "@/integrations/supabase/types/message";

interface ChatActionsReturn {
  handleSendMessage: (content: string) => Promise<{ success: boolean; error?: string }>;
  resendMessage: (message: DirectMessage) => Promise<{ success: boolean; error?: string }>;
  isUploading: boolean;
  handleMediaSelect: (files: FileList) => void;
  handleSnapCapture: (dataUrl: string) => void;
}

export const useChatActions = ({ recipientId }: { recipientId: string }): ChatActionsReturn => {
  const { toast } = useToast();

  const sendMessage = async (recipientId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          recipient_id: recipientId,
          content: content.trim()
        });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Your message has been delivered"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(recipientId, content);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send message' 
      };
    }
  };

  const resendMessage = async (message: DirectMessage) => {
    try {
      await sendMessage(recipientId, message.content || '');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to resend message' 
      };
    }
  };

  const handleMediaSelect = (files: FileList) => {
    console.log('Media selected:', files.length, 'files');
  };

  const handleSnapCapture = (dataUrl: string) => {
    console.log('Snap captured:', dataUrl.substring(0, 50) + '...');
  };

  return {
    handleSendMessage,
    resendMessage,
    isUploading: false,
    handleMediaSelect,
    handleSnapCapture
  };
};
