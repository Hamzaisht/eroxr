
import { useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { MessageActivityType, MessageActivityDetails, MessageAuditLog } from '@/types/audit';
import { useToast } from '@/hooks/use-toast';

export function useMessageAudit(recipientId?: string, messageId?: string) {
  const session = useSession();
  const { toast } = useToast();
  
  const logMessageActivity = useCallback(async (
    activityType: MessageActivityType,
    details?: MessageActivityDetails
  ): Promise<boolean> => {
    if (!session?.user?.id) {
      console.error('Cannot log message activity: No user session');
      return false;
    }
    
    try {
      const auditLog: MessageAuditLog = {
        user_id: session.user.id,
        recipient_id: recipientId || details?.recipient_id,
        message_id: messageId || details?.message_id,
        action_type: activityType,
        details: {
          ...details,
          timestamp: new Date().toISOString()
        }
      };

      const { error } = await supabase
        .from('message_audit_logs')
        .insert(auditLog);
      
      if (error) {
        console.error('Error logging message activity:', error);
        toast({
          title: "Audit Log Error",
          description: "Failed to record message activity",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (err) {
      console.error('Failed to log message activity:', err);
      return false;
    }
  }, [session?.user?.id, recipientId, messageId, toast]);
  
  return { logMessageActivity };
}
