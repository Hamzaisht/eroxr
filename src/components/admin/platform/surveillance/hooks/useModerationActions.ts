
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { LiveSession, SurveillanceContentItem } from "../types";
import { supabase } from "@/integrations/supabase/client";

export function useModerationActions() {
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const userSession = useSession();
  const { toast } = useToast();

  const handleModeration = async (
    target: LiveSession | SurveillanceContentItem, 
    action: string
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
          content_type: 'type' in target ? target.type : target.content_type,
          target_user_id: target.creator_id || target.user_id,
          target_username: target.creator_username || target.username
        }
      });

      // Handle different moderation actions
      switch (action) {
        case 'ban':
        case 'ban_user':
          // Ban the user
          await supabase.from('profiles').update({
            is_suspended: true,
            suspended_at: new Date().toISOString()
          }).eq('id', target.creator_id || target.user_id);
          
          toast({
            title: "User Banned",
            description: `${target.creator_username || target.username || 'User'} has been banned`,
          });
          break;
          
        case 'delete':
          // Handle different content types
          if ('content_type' in target) {
            // This is content that needs to be deleted
            if (target.content_type === 'post') {
              await supabase.from('posts').delete().eq('id', target.id);
            } else if (target.content_type === 'story') {
              await supabase.from('stories').update({
                is_active: false
              }).eq('id', target.id);
            } else if (target.content_type === 'video') {
              await supabase.from('videos').delete().eq('id', target.id);
            }
          } else {
            // This is a live session
            if (target.type === 'stream') {
              await supabase.from('live_streams').update({
                status: 'terminated',
                ended_at: new Date().toISOString()
              }).eq('id', target.id);
            }
          }
          
          toast({
            title: "Content Deleted",
            description: "The content has been permanently removed",
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
            }
          }
          
          toast({
            title: "Content Shadow Banned",
            description: "The content is now invisible to other users",
          });
          break;
          
        case 'flag':
          // Flag the content for review
          await supabase.from('reports').insert({
            reporter_id: userSession.user.id,
            reported_id: target.creator_id || target.user_id,
            content_id: target.id,
            content_type: 'content_type' in target ? target.content_type : target.type,
            reason: 'Flagged by admin (ghost mode)',
            status: 'pending',
            is_emergency: true,
          });
          
          toast({
            title: "Content Flagged",
            description: "The content has been flagged for review",
          });
          break;
          
        case 'view':
          // In a real implementation, you might log this view or open a new tab
          if ('content_type' in target) {
            // Simulate redirecting to content
            toast({
              title: "Viewing Content",
              description: "Opening content as if you were a regular user",
            });
          }
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

  return {
    actionInProgress,
    handleModeration
  };
}
