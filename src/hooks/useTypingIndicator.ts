
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTypingIndicator = (chatId: string, userId: string | undefined) => {
  const [isTyping, setIsTyping] = useState(false);
  
  // Send typing indicator to other users
  const sendTypingStatus = (isTyping: boolean, recipientId?: string) => {
    setIsTyping(isTyping);
    
    const targetId = recipientId || chatId;
    if (!targetId || !userId) return;
    
    // Send typing event via Supabase realtime
    supabase.channel(`chat:${targetId}`)
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { 
          userId: userId,
          recipient_id: targetId,
          is_typing: isTyping 
        }
      })
      .catch(error => {
        console.error('Error sending typing indicator:', error);
      });
  };
  
  return { isTyping, sendTypingStatus };
};
