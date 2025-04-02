
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { LiveSession, SurveillanceContentItem, ModerationAction } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useUserModeration } from "./moderation/useUserModeration";
import { useContentModeration } from "./moderation/useContentModeration";
import { useInteractionData } from "./moderation/useInteractionData";

export function useModerationActions() {
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const userSession = useSession();
  const userModeration = useUserModeration();
  const contentModeration = useContentModeration();
  const interactionData = useInteractionData();

  const handleModeration = async (
    target: LiveSession | SurveillanceContentItem, 
    action: ModerationAction,
    editedContent?: string
  ) => {
    if (!userSession?.user?.id) return;
    
    setActionInProgress(target.id);
    try {
      // Log the moderation action in admin audit logs
      await supabase.from('admin_audit_logs').insert({
        user_id: userSession.user.id,
        action: `ghost_${action}`,
        details: {
          timestamp: new Date().toISOString(),
          content_id: target.id,
          content_type: userModeration.getContentType(target),
          target_user_id: userModeration.getUserId(target),
          target_username: userModeration.getUsername(target),
          edited_content: action === 'edit' ? editedContent : undefined
        }
      });

      // Handle different moderation actions
      switch (action) {
        case 'ban':
          await userModeration.banUser(target);
          break;
          
        case 'delete':
          await contentModeration.deleteContent(target);
          break;
        
        case 'force_delete':
          await contentModeration.forceDeleteContent(target);
          break;
          
        case 'restore':
          await contentModeration.restoreContent(target);
          break;
          
        case 'edit':
          if (!editedContent) break;
          await contentModeration.editContent(target, editedContent);
          break;
          
        case 'shadowban':
          await contentModeration.shadowbanContent(target);
          break;
          
        case 'flag':
          await contentModeration.flagContent(target);
          break;
          
        case 'warn':
          await userModeration.sendWarning(target);
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    } finally {
      setActionInProgress(null);
    }
  };

  return {
    actionInProgress,
    handleModeration,
    fetchContentInteractions: interactionData.fetchContentInteractions
  };
}
