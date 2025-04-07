
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

/**
 * Hook for sending typing indicator status
 */
export const useTypingIndicator = (recipientId?: string) => {
  const session = useSession();
  const userId = session?.user?.id;
  
  const sendTypingStatus = useCallback((isTyping: boolean, targetRecipientId: string = recipientId || '') => {
    if (!userId || !targetRecipientId) return;
    
    supabase.channel('typing-status')
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          user_id: userId,
          recipient_id: targetRecipientId,
          is_typing: isTyping,
          timestamp: new Date().toISOString()
        }
      })
      .catch(error => {
        console.error('Error sending typing status:', error);
      });
  }, [userId, recipientId]);

  return { sendTypingStatus };
};
