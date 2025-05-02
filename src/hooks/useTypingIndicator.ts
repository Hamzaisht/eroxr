
import { useCallback, useState, useRef } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

export function useTypingIndicator(recipientId: string) {
  const session = useSession();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isCurrentlyTyping, setIsCurrentlyTyping] = useState(false);
  
  const sendTypingStatus = useCallback((isTyping: boolean) => {
    if (!session?.user?.id || !recipientId) return;
    
    // Update local state
    setIsCurrentlyTyping(isTyping);
    
    // Clear existing timeout if there is one
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    // Use the recipient's channel to send typing events
    const channel = supabase.channel(`typing:${recipientId}:${session.user.id}`);
    
    channel
      .subscribe()
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: session.user.id, is_typing: isTyping }
      })
      .then(() => {
        // Unsubscribe after sending
        supabase.removeChannel(channel);
        
        // If we're typing, set a timeout to automatically stop the typing indicator
        // after a period of inactivity (3 seconds)
        if (isTyping) {
          typingTimeoutRef.current = setTimeout(() => {
            sendTypingStatus(false);
          }, 3000);
        }
      })
      .catch(error => {
        console.error('Error sending typing status:', error);
      });
  }, [session?.user?.id, recipientId]);
  
  return { 
    sendTypingStatus, 
    isCurrentlyTyping 
  };
}
