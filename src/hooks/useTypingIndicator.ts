
import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

export function useTypingIndicator(recipientId: string | undefined, channel = 'typing-status') {
  const session = useSession();
  const [isTyping, setIsTyping] = useState(false);
  
  // Send typing status to other user
  const sendTypingStatus = useCallback((
    isTyping: boolean, 
    targetRecipientId?: string
  ) => {
    if (!session?.user?.id || (!recipientId && !targetRecipientId)) return;
    
    const recipient = targetRecipientId || recipientId;
    
    supabase.channel(channel).send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        is_typing: isTyping,
        user_id: session.user.id,
        recipient_id: recipient,
        timestamp: new Date().toISOString()
      }
    });
  }, [session, recipientId, channel]);
  
  return {
    isTyping,
    setIsTyping,
    sendTypingStatus
  };
}
