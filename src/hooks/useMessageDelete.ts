
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useMessageDelete(messageId: string) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const handleDelete = useCallback(async () => {
    if (!messageId) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('direct_messages')
        .delete()
        .eq('id', messageId);
      
      if (error) throw error;
      
      toast({
        title: "Message deleted",
        description: "The message has been permanently deleted"
      });
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast({
        title: "Failed to delete message",
        description: error.message || "An error occurred while deleting your message",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  }, [messageId, toast]);
  
  return {
    isDeleting,
    handleDelete
  };
}
