
import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export function useMessageDelete(messageId: string) {
  const [isDeleting, setIsDeleting] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  
  const handleDelete = useCallback(async () => {
    if (!session?.user?.id || !messageId) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('direct_messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', session.user.id);
        
      if (error) {
        throw error;
      }
      
      // Success toast
      toast({
        title: "Message deleted",
        description: "Your message has been removed",
      });
    } catch (err: any) {
      console.error('Error deleting message:', err);
      toast({
        title: "Failed to delete message",
        description: err.message || "An error occurred",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  }, [session, messageId, toast]);
  
  return {
    isDeleting,
    handleDelete
  };
}
