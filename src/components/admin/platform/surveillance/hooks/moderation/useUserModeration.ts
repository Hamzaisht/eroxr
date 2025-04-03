import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { LiveSession, SurveillanceContentItem } from "../../types";
import { supabase } from "@/integrations/supabase/client";

export function useUserModeration() {
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const userSession = useSession();
  const { toast } = useToast();

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

  const banUser = async (target: LiveSession | SurveillanceContentItem) => {
    if (!userSession?.user?.id) return false;
    
    try {
      setActionInProgress(getUserId(target));
      
      // Ban the user
      const { error } = await supabase.from('profiles').update({
        is_suspended: true,
        suspended_at: new Date().toISOString()
      }).eq('id', getUserId(target));
      
      if (error) throw error;
      
      // Also update any content from this user to be hidden
      await supabase.from('posts').update({
        visibility: 'banned'
      }).eq('creator_id', getUserId(target));
      
      await supabase.from('dating_ads').update({
        is_active: false,
        moderation_status: 'banned'
      }).eq('user_id', getUserId(target));
      
      // Log the admin action
      await supabase.from('admin_logs').insert({
        admin_id: userSession.user.id,
        action: 'ban_user',
        action_type: 'user_moderation',
        target_id: getUserId(target),
        target_type: 'user',
        details: {
          user_id: getUserId(target),
          username: getUsername(target),
          timestamp: new Date().toISOString(),
          action_taken: 'ban'
        }
      });
      
      toast({
        title: "User Banned",
        description: `${getUsername(target)} has been banned and their content hidden`,
      });
      return true;
    } catch (error) {
      console.error("Error banning user:", error);
      toast({
        title: "Ban Failed",
        description: "Could not ban user. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setActionInProgress(null);
    }
  };

  const shadowbanUser = async (target: LiveSession | SurveillanceContentItem) => {
    if (!userSession?.user?.id) return false;
    
    try {
      setActionInProgress(getUserId(target));
      
      // We don't mark the user as suspended, but hide their content
      await supabase.from('posts').update({
        visibility: 'private'
      }).eq('creator_id', getUserId(target));
      
      await supabase.from('dating_ads').update({
        is_active: false
      }).eq('user_id', getUserId(target));
      
      // Log the admin action
      await supabase.from('admin_logs').insert({
        admin_id: userSession.user.id,
        action: 'shadowban_user',
        action_type: 'user_moderation',
        target_id: getUserId(target),
        target_type: 'user',
        details: {
          user_id: getUserId(target),
          username: getUsername(target),
          timestamp: new Date().toISOString(),
          action_taken: 'shadowban'
        }
      });
      
      toast({
        title: "User Shadowbanned",
        description: `${getUsername(target)} has been shadowbanned. Their content will not be visible to others.`,
      });
      return true;
    } catch (error) {
      console.error("Error shadowbanning user:", error);
      toast({
        title: "Shadowban Failed",
        description: "Could not shadowban user. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setActionInProgress(null);
    }
  };

  const restoreUser = async (target: LiveSession | SurveillanceContentItem) => {
    if (!userSession?.user?.id) return false;
    
    try {
      setActionInProgress(getUserId(target));
      
      // Restore user account
      const { error } = await supabase.from('profiles').update({
        is_suspended: false,
        suspended_at: null
      }).eq('id', getUserId(target));
      
      if (error) throw error;
      
      // Also restore content visibility
      await supabase.from('posts').update({
        visibility: 'public'
      }).eq('creator_id', getUserId(target))
      .eq('visibility', 'banned');
      
      await supabase.from('dating_ads').update({
        is_active: true,
        moderation_status: 'approved'
      }).eq('user_id', getUserId(target))
      .eq('moderation_status', 'banned');
      
      // Log the admin action
      await supabase.from('admin_logs').insert({
        admin_id: userSession.user.id,
        action: 'restore_user',
        action_type: 'user_moderation',
        target_id: getUserId(target),
        target_type: 'user',
        details: {
          user_id: getUserId(target),
          username: getUsername(target),
          timestamp: new Date().toISOString(),
          action_taken: 'restore'
        }
      });
      
      toast({
        title: "User Restored",
        description: `${getUsername(target)} has been restored and their content is now visible.`,
      });
      return true;
    } catch (error) {
      console.error("Error restoring user:", error);
      toast({
        title: "Restore Failed",
        description: "Could not restore user. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setActionInProgress(null);
    }
  };

  const pauseAccount = async (target: LiveSession | SurveillanceContentItem, duration = 7) => {
    if (!userSession?.user?.id) return false;
    
    try {
      setActionInProgress(getUserId(target));
      
      // Set the pause end date
      const pauseEndDate = new Date();
      pauseEndDate.setDate(pauseEndDate.getDate() + duration);
      
      // Pause the account temporarily
      const { error } = await supabase.from('profiles').update({
        is_paused: true,
        pause_end_at: pauseEndDate.toISOString(),
        pause_reason: 'Administrative action' // Optional reason field
      }).eq('id', getUserId(target));
      
      if (error) throw error;
      
      // Update visibility of content during pause period
      await supabase.from('posts').update({
        visibility: 'paused'
      }).eq('creator_id', getUserId(target));
      
      // Also update dating ads if exists
      await supabase.from('dating_ads').update({
        is_active: false
      }).eq('user_id', getUserId(target));
      
      // Log the admin action with more detailed information
      await supabase.from('admin_logs').insert({
        admin_id: userSession.user.id,
        action: 'pause_account',
        action_type: 'user_moderation',
        target_id: getUserId(target),
        target_type: 'user',
        details: {
          user_id: getUserId(target),
          username: getUsername(target),
          timestamp: new Date().toISOString(),
          action_taken: 'pause',
          duration_days: duration,
          pause_end_date: pauseEndDate.toISOString(),
          admin_email: userSession.user.email,
          reason: 'Administrative action'
        }
      });
      
      toast({
        title: "Account Paused",
        description: `${getUsername(target)}'s account has been paused for ${duration} days.`,
      });
      return true;
    } catch (error) {
      console.error("Error pausing account:", error);
      toast({
        title: "Pause Failed",
        description: "Could not pause account. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setActionInProgress(null);
    }
  };

  const unpauseAccount = async (target: LiveSession | SurveillanceContentItem) => {
    if (!userSession?.user?.id) return false;
    
    try {
      setActionInProgress(getUserId(target));
      
      // Unpause the account
      const { error } = await supabase.from('profiles').update({
        is_paused: false,
        pause_end_at: null,
        pause_reason: null
      }).eq('id', getUserId(target));
      
      if (error) throw error;
      
      // Restore visibility of content 
      await supabase.from('posts').update({
        visibility: 'public'
      }).eq('creator_id', getUserId(target))
      .eq('visibility', 'paused');
      
      // Also update dating ads if applicable
      await supabase.from('dating_ads').update({
        is_active: true
      }).eq('user_id', getUserId(target))
      .eq('is_active', false);
      
      // Log the admin action
      await supabase.from('admin_logs').insert({
        admin_id: userSession.user.id,
        action: 'unpause_account',
        action_type: 'user_moderation',
        target_id: getUserId(target),
        target_type: 'user',
        details: {
          user_id: getUserId(target),
          username: getUsername(target),
          timestamp: new Date().toISOString(),
          action_taken: 'unpause'
        }
      });
      
      toast({
        title: "Account Unpaused",
        description: `${getUsername(target)}'s account has been manually unpaused.`,
      });
      return true;
    } catch (error) {
      console.error("Error unpausing account:", error);
      toast({
        title: "Unpause Failed",
        description: "Could not unpause account. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setActionInProgress(null);
    }
  };

  const deleteUser = async (target: LiveSession | SurveillanceContentItem) => {
    if (!userSession?.user?.id) return false;
    
    try {
      setActionInProgress(getUserId(target));
      
      // Mark the user for deletion
      // Note: Actual deletion would likely be handled by a backend process
      const { error } = await supabase.from('profiles').update({
        is_suspended: true,
        suspended_at: new Date().toISOString(),
        marked_for_deletion: true, // This would need to be added to the profiles table
        scheduled_deletion_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
      }).eq('id', getUserId(target));
      
      if (error) throw error;
      
      // Hide all content immediately
      await supabase.from('posts').update({
        visibility: 'deleted'
      }).eq('creator_id', getUserId(target));
      
      await supabase.from('dating_ads').update({
        is_active: false,
        moderation_status: 'deleted'
      }).eq('user_id', getUserId(target));
      
      // Log the admin action
      await supabase.from('admin_logs').insert({
        admin_id: userSession.user.id,
        action: 'delete_user',
        action_type: 'user_moderation',
        target_id: getUserId(target),
        target_type: 'user',
        details: {
          user_id: getUserId(target),
          username: getUsername(target),
          timestamp: new Date().toISOString(),
          action_taken: 'delete',
          scheduled_deletion_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        }
      });
      
      toast({
        title: "User Deleted",
        description: `${getUsername(target)} has been scheduled for deletion. All content has been hidden.`,
      });
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Deletion Failed",
        description: "Could not delete user. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setActionInProgress(null);
    }
  };

  const sendWarning = async (target: LiveSession | SurveillanceContentItem) => {
    if (!userSession?.user?.id) return false;
    
    try {
      setActionInProgress(getUserId(target));
      
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
      
      // Log the admin action
      await supabase.from('admin_logs').insert({
        admin_id: userSession.user.id,
        action: 'send_warning',
        action_type: 'user_moderation',
        target_id: getUserId(target),
        target_type: 'user',
        details: {
          user_id: getUserId(target),
          username: getUsername(target),
          timestamp: new Date().toISOString(),
          action_taken: 'warn',
          warning_details: warningDetails
        }
      });
      
      toast({
        title: "Warning Sent",
        description: `A warning has been sent to ${getUsername(target)}`,
      });
      return true;
    } catch (error) {
      console.error("Error sending warning:", error);
      toast({
        title: "Warning Failed",
        description: "Could not send warning. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setActionInProgress(null);
    }
  };

  const getContentType = (item: LiveSession | SurveillanceContentItem): string => {
    if ('content_type' in item && item.content_type) return item.content_type;
    if ('type' in item) return item.type;
    return 'unknown';
  };

  return {
    actionInProgress,
    setActionInProgress,
    getUserId,
    getUsername,
    getContentType,
    banUser,
    shadowbanUser,
    restoreUser,
    pauseAccount,
    unpauseAccount,
    deleteUser,
    sendWarning
  };
}
