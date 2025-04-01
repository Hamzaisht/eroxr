import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { LiveSession, SurveillanceContentItem } from "../types";
import { supabase } from "@/integrations/supabase/client";

export type ModerationAction = 
  | 'flag' 
  | 'warn' 
  | 'ban' 
  | 'delete' 
  | 'edit' 
  | 'shadowban' 
  | 'restore' 
  | 'force_delete' 
  | 'view';

export function useModerationActions() {
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const userSession = useSession();
  const { toast } = useToast();

  const handleModeration = async (
    target: LiveSession | SurveillanceContentItem, 
    action: ModerationAction,
    editedContent?: string
  ) => {
    if (!userSession?.user?.id) return;
    
    setActionInProgress(target.id);
    try {
      // Helper function to get the user ID consistently
      const getUserId = (item: LiveSession | SurveillanceContentItem): string => {
        if ('creator_id' in item && item.creator_id) return item.creator_id;
        if ('user_id' in item && item.user_id) return item.user_id;
        return 'unknown';
      };
      
      // Helper function to get the username consistently
      const getUsername = (item: LiveSession | SurveillanceContentItem): string => {
        if ('creator_username' in item && item.creator_username) return item.creator_username;
        if ('username' in item && item.username) return item.username || 'Unknown';
        return 'Unknown';
      };
      
      // Helper function to get the content type consistently
      const getContentType = (item: LiveSession | SurveillanceContentItem): string => {
        if ('content_type' in item && item.content_type) return item.content_type;
        if ('type' in item) return item.type;
        return 'unknown';
      };
      
      // Log the moderation action in admin audit logs
      await supabase.from('admin_audit_logs').insert({
        user_id: userSession.user.id,
        action: `ghost_${action}`,
        details: {
          timestamp: new Date().toISOString(),
          content_id: target.id,
          content_type: getContentType(target),
          target_user_id: getUserId(target),
          target_username: getUsername(target),
          edited_content: action === 'edit' ? editedContent : undefined
        }
      });

      // Handle different moderation actions
      switch (action) {
        case 'ban':
          // Ban the user
          await supabase.from('profiles').update({
            is_suspended: true,
            suspended_at: new Date().toISOString()
          }).eq('id', getUserId(target));
          
          // Also update any content from this user to be hidden
          await supabase.from('posts').update({
            visibility: 'banned'
          }).eq('creator_id', getUserId(target));
          
          await supabase.from('dating_ads').update({
            is_active: false,
            moderation_status: 'banned'
          }).eq('user_id', getUserId(target));
          
          toast({
            title: "User Banned",
            description: `${getUsername(target)} has been banned and their content hidden`,
          });
          break;
          
        case 'delete':
          // Handle different content types
          if ('content_type' in target) {
            // This is content that needs to be deleted
            if (target.content_type === 'post') {
              await supabase.from('posts').update({
                visibility: 'deleted'
              }).eq('id', target.id);
            } else if (target.content_type === 'story') {
              await supabase.from('stories').update({
                is_active: false
              }).eq('id', target.id);
            } else if (target.content_type === 'video') {
              await supabase.from('videos').update({
                visibility: 'deleted'
              }).eq('id', target.id);
            } else if (target.content_type === 'ad') {
              await supabase.from('dating_ads').update({
                is_active: false,
                moderation_status: 'deleted'
              }).eq('id', target.id);
            }
          } else {
            // This is a live session
            if (target.type === 'stream') {
              await supabase.from('live_streams').update({
                status: 'terminated',
                ended_at: new Date().toISOString()
              }).eq('id', target.id);
            } else if (target.type === 'chat') {
              await supabase.from('direct_messages').update({
                content: '[Content removed by moderator]',
                original_content: target.content
              }).eq('id', target.id);
            } else if (target.type === 'bodycontact') {
              await supabase.from('dating_ads').update({
                is_active: false,
                moderation_status: 'deleted'
              }).eq('id', target.id);
            }
          }
          
          toast({
            title: "Content Deleted",
            description: "The content has been hidden from users",
          });
          break;
        
        case 'force_delete':
          // Actually delete the content permanently
          if ('content_type' in target) {
            if (target.content_type === 'post') {
              await supabase.from('posts').delete().eq('id', target.id);
            } else if (target.content_type === 'story') {
              await supabase.from('stories').delete().eq('id', target.id);
            } else if (target.content_type === 'video') {
              await supabase.from('videos').delete().eq('id', target.id);
            } else if (target.content_type === 'ad') {
              await supabase.from('dating_ads').delete().eq('id', target.id);
            }
          } else {
            if (target.type === 'chat') {
              await supabase.from('direct_messages').delete().eq('id', target.id);
            } else if (target.type === 'bodycontact') {
              await supabase.from('dating_ads').delete().eq('id', target.id);
            }
          }
          
          toast({
            title: "Content Permanently Removed",
            description: "The content has been permanently deleted from the database",
            variant: "destructive"
          });
          break;
          
        case 'restore':
          // Restore content that was previously deleted
          if ('content_type' in target) {
            if (target.content_type === 'post') {
              await supabase.from('posts').update({
                visibility: 'public'
              }).eq('id', target.id);
            } else if (target.content_type === 'story') {
              await supabase.from('stories').update({
                is_active: true
              }).eq('id', target.id);
            } else if (target.content_type === 'video') {
              await supabase.from('videos').update({
                visibility: 'public'
              }).eq('id', target.id);
            } else if (target.content_type === 'ad') {
              await supabase.from('dating_ads').update({
                is_active: true,
                moderation_status: 'approved'
              }).eq('id', target.id);
            }
          } else if (target.type === 'chat' && 'metadata' in target && target.metadata?.original_content) {
            await supabase.from('direct_messages').update({
              content: target.metadata.original_content,
              original_content: null
            }).eq('id', target.id);
          }
          
          toast({
            title: "Content Restored",
            description: "The content has been restored and is now visible to users again",
          });
          break;
          
        case 'edit':
          if (!editedContent) {
            toast({
              title: "Edit Failed",
              description: "No edited content provided",
              variant: "destructive"
            });
            break;
          }
          
          if ('content_type' in target) {
            if (target.content_type === 'post') {
              await supabase.from('posts').update({
                content: editedContent,
                updated_at: new Date().toISOString(),
                last_modified_by: userSession.user.id
              }).eq('id', target.id);
            } else if (target.content_type === 'ad') {
              await supabase.from('dating_ads').update({
                description: editedContent,
                updated_at: new Date().toISOString(),
                last_modified_by: userSession.user.id
              }).eq('id', target.id);
            }
          } else if (target.type === 'chat') {
            await supabase.from('direct_messages').update({
              content: editedContent,
              original_content: target.content,
              updated_at: new Date().toISOString()
            }).eq('id', target.id);
          }
          
          toast({
            title: "Content Edited",
            description: "The content has been updated",
          });
          break;
          
        case 'shadowban':
          // Shadowban the content (make it invisible to others without notifying the creator)
          if ('content_type' in target) {
            if (target.content_type === 'post') {
              await supabase.from('posts').update({
                visibility: 'shadowbanned'
              }).eq('id', target.id);
            } else if (target.content_type === 'video') {
              await supabase.from('videos').update({
                visibility: 'shadowbanned'
              }).eq('id', target.id);
            } else if (target.content_type === 'ad') {
              await supabase.from('dating_ads').update({
                moderation_status: 'shadowbanned'
              }).eq('id', target.id);
            }
          }
          
          toast({
            title: "Content Shadow Banned",
            description: "The content is now invisible to other users but remains visible to the creator",
          });
          break;
          
        case 'flag':
          // Flag the content for review
          await supabase.from('reports').insert({
            reporter_id: userSession.user.id,
            reported_id: getUserId(target),
            content_id: target.id,
            content_type: getContentType(target),
            reason: 'Flagged by admin (ghost mode)',
            status: 'pending',
            is_emergency: true,
          });
          
          toast({
            title: "Content Flagged",
            description: "The content has been flagged for further review",
          });
          break;
          
        case 'warn':
          // Send a warning to the user
          const warningDetails = {
            admin_id: userSession.user.id,
            content_id: target.id,
            content_type: getContentType(target),
            timestamp: new Date().toISOString()
          };
          
          // Insert notification to the user
          await supabase.from('notifications').insert({
            user_id: getUserId(target),
            type: 'admin_warning',
            content: JSON.stringify(warningDetails),
            is_read: false
          });
          
          toast({
            title: "Warning Sent",
            description: `A warning has been sent to ${getUsername(target)}`,
          });
          break;
          
        case 'view':
          // Log view action but don't do anything else
          toast({
            title: "Viewing Content",
            description: "Opening content as if you were a regular user",
          });
          break;
          
        default:
          toast({
            title: "Action Completed",
            description: `Successfully performed ${action}`,
          });
      }
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

  // Fetch users who interacted with content
  const fetchContentInteractions = async (contentId: string, contentType: string) => {
    try {
      let interactionsData = {
        viewers: [],
        likers: [],
        buyers: []
      };
      
      // Fetch viewers
      if (contentType === 'post') {
        const { data: viewData } = await supabase
          .from('post_media_actions')
          .select(`
            user_id,
            created_at,
            profiles(username, avatar_url)
          `)
          .eq('post_id', contentId)
          .eq('action_type', 'view');
          
        if (viewData) interactionsData.viewers = viewData;
      }
      
      // Fetch likers
      if (contentType === 'post') {
        const { data: likeData } = await supabase
          .from('post_likes')
          .select(`
            user_id,
            created_at,
            profiles(username, avatar_url)
          `)
          .eq('post_id', contentId);
          
        if (likeData) interactionsData.likers = likeData;
      }
      
      // Fetch buyers
      if (contentType === 'post') {
        const { data: purchaseData } = await supabase
          .from('post_purchases')
          .select(`
            user_id,
            amount,
            created_at,
            profiles(username, avatar_url)
          `)
          .eq('post_id', contentId);
          
        if (purchaseData) interactionsData.buyers = purchaseData;
      }
      
      return interactionsData;
    } catch (error) {
      console.error("Error fetching content interactions:", error);
      toast({
        title: "Error",
        description: "Could not load content interaction data",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    actionInProgress,
    handleModeration,
    fetchContentInteractions
  };
}
