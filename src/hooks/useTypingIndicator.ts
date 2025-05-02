
import { useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

export function useTypingIndicator(recipientId: string) {
  const session = useSession();
  
  const sendTypingStatus = useCallback((isTyping: boolean) => {
    if (!session?.user?.id || !recipientId) return;
    
    console.log(`Sending typing status ${isTyping ? 'started' : 'stopped'} to ${recipientId}`);
    
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
      })
      .catch(error => {
        console.error('Error sending typing status:', error);
      });
  }, [session?.user?.id, recipientId]);
  
  return { sendTypingStatus };
}
