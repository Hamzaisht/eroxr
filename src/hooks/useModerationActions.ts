
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define action types
export type ModerationAction = 
  | "view" 
  | "edit"
  | "flag"
  | "warn"
  | "shadowban"
  | "delete"
  | "ban"
  | "restore"
  | "force_delete";

export interface LiveSession {
  id: string;
  user_id: string;
  type: "stream" | "call" | "chat" | "bodycontact";
  username?: string;
  avatar_url?: string;
  created_at: string;
  content?: string;
  media_url: string[] | string;
  status?: string;
  message_type?: string;
  content_type?: string;
  recipient_id?: string;
  recipient_username?: string;
  sender_username?: string;
  title?: string;
  description?: string;
  location?: string;
  tags?: string[];
  viewer_count?: number;
  duration?: number;
  metadata?: Record<string, any>;
  started_at?: string;
  creator_id?: string;
  creator_username?: string;
  about_me?: string;
  video_url?: string;
}

export interface SurveillanceContentItem {
  id: string;
  type: string;
  content_type?: string;
  creator_id?: string;
  user_id?: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
  content?: string;
  media_url: string[] | string;
  status?: string;
  title?: string;
  description?: string;
  creator_username?: string;
  creator_avatar_url?: string;
  visibility?: string;
  is_ppv?: boolean;
  ppv_amount?: number;
  likes_count?: number;
  comments_count?: number;
  view_count?: number;
  duration?: number;
  is_active?: boolean;
  is_deleted?: boolean;
  is_draft?: boolean;
  is_flagged?: boolean;
  video_url?: string;
  audio_url?: string;
  tags?: string[];
  location?: string;
  use_count?: number;
  expires_at?: string;
}

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
      const contentType = content.type || 'unknown';
      let targetTable = '';
      let statusField = 'status';
      let updates = {};
      
      switch (contentType) {
        case 'stream':
          targetTable = 'live_streams';
          break;
        case 'call':
          targetTable = 'calls';
          break;
        case 'chat':
          targetTable = 'direct_messages';
          break;
        case 'bodycontact':
          targetTable = 'dating_ads';
          statusField = 'moderation_status';
          break;
        case 'post':
        case 'video':
        case 'audio':
        case 'story':
          // Handle other content types
          targetTable = contentType === 'post' ? 'posts' 
                      : contentType === 'video' ? 'videos'
                      : contentType === 'audio' ? 'sounds'
                      : 'stories';
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
          if (contentType === 'post' || contentType === 'video' || contentType === 'story' || contentType === 'audio') {
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
