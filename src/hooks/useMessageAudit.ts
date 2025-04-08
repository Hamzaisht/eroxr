
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMessageAudit = (messageId?: string, userId?: string) => {
  useEffect(() => {
    if (!messageId || !userId) return;
    
    // Log message view for audit purposes
    const logMessageView = async () => {
      try {
        await supabase.from('admin_audit_logs').insert({
          user_id: userId,
          action: 'message_viewed',
          details: {
            message_id: messageId,
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Error logging message view:', error);
      }
    };
    
    logMessageView();
  }, [messageId, userId]);
  
  // Add the logMessageActivity function to match usage in MessageInput
  const logMessageActivity = (action: string, details: any) => {
    if (!userId) return;
    
    try {
      supabase.from('admin_audit_logs').insert({
        user_id: userId,
        action,
        details: {
          ...details,
          timestamp: new Date().toISOString()
        }
      }).then(() => {
        // Success
      }).catch(error => {
        console.error('Error logging message activity:', error);
      });
    } catch (error) {
      console.error('Error logging message activity:', error);
    }
  };
  
  return { logMessageActivity };
};
