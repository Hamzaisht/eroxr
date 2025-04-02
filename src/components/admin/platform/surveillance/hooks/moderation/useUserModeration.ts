
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
      return true;
    } catch (error) {
      console.error("Error banning user:", error);
      toast({
        title: "Ban Failed",
        description: "Could not ban user. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const sendWarning = async (target: LiveSession | SurveillanceContentItem) => {
    if (!userSession?.user?.id) return false;
    
    try {
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
      return true;
    } catch (error) {
      console.error("Error sending warning:", error);
      toast({
        title: "Warning Failed",
        description: "Could not send warning. Please try again.",
        variant: "destructive"
      });
      return false;
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
    sendWarning
  };
}
