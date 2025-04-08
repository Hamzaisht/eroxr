
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTypingIndicator = (chatId: string, userId: string | undefined) => {
  const [isTyping, setIsTyping] = useState(false);
  
  // Send typing indicator to other users
  const sendTypingStatus = (isTyping: boolean) => {
    setIsTyping(isTyping);
    
    if (!chatId || !userId) return;
    
    // Send typing event via Supabase realtime
    supabase.channel(`chat:${chatId}`)
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { 
          userId: userId,
          recipient_id: chatId,
          is_typing: isTyping 
        }
      })
      .catch(error => {
        console.error('Error sending typing indicator:', error);
      });
  };
  
  return { isTyping, sendTypingStatus };
};
