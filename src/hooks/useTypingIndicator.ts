
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTypingIndicator = (chatId: string, userId: string) => {
  const [isTyping, setIsTyping] = useState(false);
  
  // Send typing indicator to other users
  const sendTypingIndicator = () => {
    // Only send if we're not already shown as typing
    if (!isTyping) {
      setIsTyping(true);
      
      // Send typing event via Supabase realtime
      supabase.channel(`chat:${chatId}`)
        .send({
          type: 'broadcast',
          event: 'typing',
          payload: { userId }
        })
        .then(() => {
          // Auto-reset typing after 2 seconds
          setTimeout(() => {
            setIsTyping(false);
          }, 2000);
        })
        .catch(error => {
          console.error('Error sending typing indicator:', error);
          setIsTyping(false);
        });
    }
  };
  
  return { isTyping, sendTypingIndicator };
};
