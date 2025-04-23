
import { useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

type MessageActivityType = 
  | 'send_attempt'
  | 'media_upload'
  | 'document_upload'  // Added this line
  | 'message_view'
  | 'message_delete'
  | 'message_edit'
  | 'message_react'
  | 'call_attempt'
  | 'call_answer'
  | 'call_end'
  | 'error';

interface MessageActivityDetails {
  recipient_id?: string;
  message_id?: string;
  content?: string;
  duration?: number;
  error?: string;
  message_type?: string;
  file_count?: number;
  file_types?: string[];
  [key: string]: any;
}

export function useMessageAudit(recipientId?: string, messageId?: string) {
  const session = useSession();
  
  const logMessageActivity = useCallback(async (
    activityType: MessageActivityType,
    details?: MessageActivityDetails
  ) => {
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase.from('message_audit_logs').insert({
        user_id: session.user.id,
        recipient_id: recipientId || details?.recipient_id,
        message_id: messageId || details?.message_id,
        action_type: activityType,
        details: {
          ...details,
          timestamp: new Date().toISOString()
        }
      });
      
      if (error) {
        console.error('Error logging message activity:', error);
      }
    } catch (err) {
      console.error('Failed to log message activity:', err);
    }
  }, [session?.user?.id, recipientId, messageId]);
  
  return { logMessageActivity };
}
