
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { LiveSession } from "../../user-analytics/types";
import { supabase } from "@/integrations/supabase/client";

export function useModerationActions() {
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const userSession = useSession();
  const { toast } = useToast();

  const handleModeration = async (session: LiveSession, action: string) => {
    if (!userSession?.user?.id) return;
    
    setActionInProgress(session.id);
    try {
      // Log the moderation action in admin audit logs
      await supabase.from('admin_audit_logs').insert({
        user_id: userSession.user.id,
        action: `ghost_${action}`,
        details: {
          timestamp: new Date().toISOString(),
          session_id: session.id,
          session_type: session.type,
          target_user_id: session.user_id,
          target_username: session.username
        }
      });

      // For more serious actions like ban, we'll need additional API calls
      if (action === 'ban') {
        await supabase.from('profiles').update({
          is_suspended: true,
          suspended_at: new Date().toISOString()
        }).eq('id', session.user_id);
      }

      toast({
        title: "Action Completed",
        description: `Successfully performed ${action} on ${session.username || 'Unknown'}`,
      });
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      toast({
        title: "Action Failed",
        description: `Could not perform ${action}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setActionInProgress(null);
    }
  };

  return {
    actionInProgress,
    handleModeration
  };
}
