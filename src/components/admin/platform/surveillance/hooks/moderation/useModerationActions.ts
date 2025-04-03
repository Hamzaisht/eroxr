
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { LiveSession, SurveillanceContentItem, ModerationAction } from "../../types";
import { supabase } from "@/integrations/supabase/client";

export function useModerationActions() {
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const { toast } = useToast();
  const session = useSession();
  
  const handleModeration = async (
    content: LiveSession | SurveillanceContentItem, 
    action: ModerationAction,
    editedContent?: string
  ) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to perform this action",
        variant: "destructive"
      });
      return;
    }
    
    const contentId = content.id;
    setActionInProgress(contentId);
    
    try {
      // Determine content type and database table
      // Check if the content is a LiveSession or a SurveillanceContentItem
      const contentType = 'type' in content ? content.type : 
                          'content_type' in content ? content.content_type : 'unknown';
      
      let targetTable = '';
      let statusField = 'status';
      let updates = {};
      
      switch (contentType) {
        case 'stream':
          targetTable = 'live_streams';
          break;
        case 'chat':
          targetTable = 'direct_messages';
          break;
        case 'call':
          targetTable = 'calls';
          break;
        case 'bodycontact':
          targetTable = 'dating_ads';
          statusField = 'moderation_status';
          break;
        case 'post':
        case 'posts':
          targetTable = 'posts';
          break;
        case 'video':
        case 'videos':
          targetTable = 'videos';
          break;
        default:
          toast({
            title: "Action Failed",
            description: `Unknown content type: ${contentType}`,
            variant: "destructive"
          });
          return;
      }
      
      // Prepare updates based on action
      switch (action) {
        case 'ban':
          // Flag in flagged_content table and update user profile
          await supabase.from('flagged_content').insert({
            content_id: contentId,
            content_type: contentType,
            flagged_by: session.user.id,
            reason: 'Admin ban action',
            status: 'banned',
            severity: 'high'
          });
          
          // Mark user as suspended if content has user_id
          if ('user_id' in content && content.user_id) {
            await supabase
              .from('profiles')
              .update({ 
                is_suspended: true,
                suspended_at: new Date().toISOString()
              })
              .eq('id', content.user_id);
          }
          break;
          
        case 'flag':
          // Add to flagged_content table
          await supabase.from('flagged_content').insert({
            content_id: contentId,
            content_type: contentType,
            flagged_by: session.user.id,
            reason: 'Admin flag action',
            status: 'flagged',
            severity: 'medium'
          });
          
          // Update status in original table
          updates = { [statusField]: 'flagged' };
          break;
          
        case 'delete':
          // For soft delete, we update status
          updates = { [statusField]: 'deleted' };
          break;
          
        case 'shadowban':
          // Similar to flagging but different visibility impact
          await supabase.from('flagged_content').insert({
            content_id: contentId,
            content_type: contentType,
            flagged_by: session.user.id,
            reason: 'Admin shadowban action',
            status: 'shadowbanned',
            severity: 'medium'
          });
          
          // Update visibility in original table where applicable
          if (contentType === 'post' || contentType === 'video') {
            updates = { visibility: 'private' };
          } else {
            updates = { [statusField]: 'hidden' };
          }
          break;
          
        case 'edit':
          // Apply content edits
          if (editedContent) {
            updates = { content: editedContent };
          }
          break;
          
        default:
          toast({
            title: "Action Failed",
            description: `Unknown action: ${action}`,
            variant: "destructive"
          });
          return;
      }
      
      // Apply updates to the target table if there are any
      if (Object.keys(updates).length > 0 && targetTable) {
        const { error: updateError } = await supabase
          .from(targetTable)
          .update(updates)
          .eq('id', contentId);
          
        if (updateError) {
          console.error(`Error updating ${targetTable}:`, updateError);
          throw new Error(`Failed to update ${targetTable}`);
        }
      }
      
      // Log the admin action
      await supabase.from('admin_logs').insert({
        admin_id: session.user.id,
        target_id: contentId,
        action: action,
        action_type: 'moderation',
        target_type: contentType,
        details: {
          content_type: contentType,
          action_taken: action,
          timestamp: new Date().toISOString(),
          updates: updates,
          content_id: contentId,
          user_id: 'user_id' in content ? content.user_id : null
        }
      });
      
      toast({
        title: "Action Successful",
        description: `The ${action} action was applied successfully`,
      });
      
    } catch (error) {
      console.error(`Error handling moderation action ${action}:`, error);
      toast({
        title: "Action Failed",
        description: `Failed to apply ${action} action. Please try again.`,
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
