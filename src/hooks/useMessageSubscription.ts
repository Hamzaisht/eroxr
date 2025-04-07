
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

export const useMessageSubscription = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const session = useSession();

  useEffect(() => {
    if (!userId) return;

    // Subscribe to all message events for audit logging
    const channel = supabase
      .channel('messages-audit')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'direct_messages',
          filter: `recipient_id=eq.${userId} OR sender_id=eq.${userId}`,
        },
        (payload) => {
          // Log message events for admins
          if (session?.user?.id) {
            const eventType = payload.eventType;
            const messageData = payload.new || payload.old;
            
            // If in admin mode, record audit logs
            if (session.user.user_metadata?.role === 'admin' || 
                session.user.user_metadata?.role === 'super_admin') {
              logMessageActivity(eventType, messageData, session.user.id);
            }
            
            // Update message cache
            queryClient.invalidateQueries({ queryKey: ['chat'] });
            queryClient.invalidateQueries({ queryKey: ['messages'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient, session]);
  
  // Log message activity to admin_audit_logs table
  const logMessageActivity = async (
    eventType: string, 
    messageData: any, 
    adminId: string
  ) => {
    try {
      const clientInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      await supabase.from('admin_audit_logs').insert({
        user_id: adminId,
        action: `message_${eventType.toLowerCase()}`,
        details: {
          message_id: messageData.id,
          sender_id: messageData.sender_id,
          recipient_id: messageData.recipient_id,
          message_type: messageData.message_type,
          timestamp: new Date().toISOString(),
          client_info: clientInfo
        }
      });
    } catch (error) {
      console.error('Failed to log message audit:', error);
    }
  };
};
