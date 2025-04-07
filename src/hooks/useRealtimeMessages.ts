
import { useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTypingIndicator = (recipientId: string) => {
  const sendTypingStatus = useCallback((isTyping: boolean) => {
    if (!recipientId) return;
    
    const message = {
      type: 'typing_indicator',
      sender_id: supabase.auth.getUser()?.data?.user?.id,
      recipient_id: recipientId,
      is_typing: isTyping
    };

    // Send typing status through realtime channel
    supabase
      .channel('typing-indicator')
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: message
      })
      .catch(error => {
        console.error('Error sending typing status:', error);
      });
  }, [recipientId]);

  return { sendTypingStatus };
};

export const useMessageAudit = () => {
  const logMessageActivity = useCallback(async (action: string, messageData: any) => {
    try {
      const session = await supabase.auth.getSession();
      const userId = session?.data?.session?.user?.id;
      
      if (!userId) return;
      
      const clientInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      await supabase.from('admin_audit_logs').insert({
        user_id: userId,
        action: `message_${action}`,
        details: {
          message_id: messageData.id,
          timestamp: new Date().toISOString(),
          client_info: clientInfo,
          content_type: messageData.message_type,
          recipient_id: messageData.recipient_id,
          has_media: !!messageData.media_url?.length
        }
      });
    } catch (error) {
      console.error('Failed to log message audit:', error);
    }
  }, []);

  return { logMessageActivity };
};
