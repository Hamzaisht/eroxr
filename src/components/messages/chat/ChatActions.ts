
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useChatActions = () => {
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
    }
  };

  return { sendMessage };
};
