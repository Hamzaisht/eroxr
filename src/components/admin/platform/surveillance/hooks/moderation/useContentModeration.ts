
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { LiveSession, SurveillanceContentItem } from "../../types";
import { supabase } from "@/integrations/supabase/client";
import { useUserModeration } from "./useUserModeration";

export function useContentModeration() {
  const userSession = useSession();
  const { toast } = useToast();
  const { getContentType, getUserId } = useUserModeration();

  const deleteContent = async (target: LiveSession | SurveillanceContentItem) => {
    if (!userSession?.user?.id) return false;

    try {
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
      return true;
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete content. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const forceDeleteContent = async (target: LiveSession | SurveillanceContentItem) => {
    if (!userSession?.user?.id) return false;

    try {
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
      return true;
    } catch (error) {
      console.error("Error force deleting content:", error);
      toast({
        title: "Force Delete Failed",
        description: "Could not permanently delete content. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const restoreContent = async (target: LiveSession | SurveillanceContentItem) => {
    if (!userSession?.user?.id) return false;

    try {
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
      return true;
    } catch (error) {
      console.error("Error restoring content:", error);
      toast({
        title: "Restore Failed",
        description: "Could not restore content. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const editContent = async (target: LiveSession | SurveillanceContentItem, editedContent: string) => {
    if (!userSession?.user?.id || !editedContent) return false;

    try {
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
      return true;
    } catch (error) {
      console.error("Error editing content:", error);
      toast({
        title: "Edit Failed",
        description: "Could not edit content. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const shadowbanContent = async (target: LiveSession | SurveillanceContentItem) => {
    if (!userSession?.user?.id) return false;

    try {
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
      return true;
    } catch (error) {
      console.error("Error shadowbanning content:", error);
      toast({
        title: "Shadow Ban Failed",
        description: "Could not shadowban content. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const flagContent = async (target: LiveSession | SurveillanceContentItem) => {
    if (!userSession?.user?.id) return false;

    try {
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
      return true;
    } catch (error) {
      console.error("Error flagging content:", error);
      toast({
        title: "Flag Failed",
        description: "Could not flag content. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    deleteContent,
    forceDeleteContent,
    restoreContent,
    editContent,
    shadowbanContent,
    flagContent
  };
}
