
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

export function useTypingIndicator(recipientId?: string) {
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const session = useSession();
  
  // Send typing status via channel broadcast
  const sendTypingStatus = useCallback((typing: boolean) => {
    if (!session?.user?.id || !recipientId) return;
    
    const channel = supabase.channel(`typing:${recipientId}:${session.user.id}`);
    
    // Only create subscription if we're sending a typing status
    if (typing) {
      channel.subscribe();
      
      // Send the typing event after subscription
      channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          user_id: session.user.id,
          is_typing: typing
        }
      });
    }
    
  }, [recipientId, session?.user?.id]);
  
  return { 
    isTyping, 
    setIsTyping,
    sendTypingStatus 
  };
}
