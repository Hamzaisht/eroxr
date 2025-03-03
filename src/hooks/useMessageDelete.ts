
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useMessageDelete = (messageId: string) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      setTimeout(async () => {
        const { error } = await supabase
          .from('direct_messages')
          .delete()
          .eq('id', messageId);

        if (error) throw error;

        toast({
          description: "Message deleted successfully",
        });
      }, 500);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete message",
      });
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    handleDelete
  };
};
