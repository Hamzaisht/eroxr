
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

/**
 * Hook for logging message activity for audit purposes
 */
export const useMessageAudit = () => {
  const session = useSession();
  
  const logMessageActivity = useCallback(async (
    eventType: string, 
    messageData: any
  ) => {
    try {
      if (!session?.user?.id) return;
      
      const clientInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: `message_${eventType.toLowerCase()}`,
        details: {
          message_data: messageData,
          client_info: clientInfo,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to log message audit:', error);
    }
  }, [session]);

  return { logMessageActivity };
};
