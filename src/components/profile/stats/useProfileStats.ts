
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ProfileStats as ProfileStatsType } from "./types";

export const useProfileStats = (profileId: string) => {
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [userListType, setUserListType] = useState<'followers' | 'subscribers'>('followers');
  const [isTipLoading, setIsTipLoading] = useState(false);
  const { toast } = useToast();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["profileStats", profileId],
    queryFn: async () => {
      try {
        const [
          { count: followerCount, error: followerError }, 
          { count: likeCount, error: likeError }, 
          { data: posts, error: postError },
          { count: subscriberCount, error: subError }
        ] = await Promise.all([
          supabase
            .from("followers")
            .select("*", { count: 'exact', head: true })
            .eq("following_id", profileId),
          supabase
            .from("post_likes")
            .select("posts!inner(*)", { count: 'exact', head: true })
            .eq("posts.creator_id", profileId),
          supabase
            .from("posts")
            .select("id, is_ppv")
            .eq("creator_id", profileId),
          supabase
            .from("creator_subscriptions")
            .select("*", { count: 'exact', head: true })
            .eq("creator_id", profileId)
        ]);

        if (followerError) throw followerError;
        if (likeError) throw likeError;
        if (postError) throw postError;
        if (subError) throw subError;

        const postCount = posts?.length || 0;
        const premiumPostCount = posts?.filter(post => post.is_ppv).length || 0;

        return {
          follower_count: followerCount || 0,
          like_count: likeCount || 0,
          post_count: postCount,
          premium_post_count: premiumPostCount,
          subscriber_count: subscriberCount || 0
        } as ProfileStatsType;
      } catch (error: any) {
        console.error("Error fetching profile stats:", error);
        toast({
          title: "Error loading stats",
          description: "Failed to load profile statistics. Please try again later.",
          variant: "destructive"
        });
        throw new Error("Failed to fetch profile statistics");
      }
    },
    retry: 2,
    staleTime: 30000
  });

  const handleShowUserList = (type: 'followers' | 'subscribers') => {
    setUserListType(type);
    setShowUserList(true);
  };

  const handleShowTipDialog = () => {
    setShowTipDialog(true);
  };

  return {
    stats,
    isLoading,
    error,
    showTipDialog,
    setShowTipDialog,
    showUserList,
    setShowUserList,
    userListType,
    isTipLoading,
    setIsTipLoading,
    handleShowUserList,
    handleShowTipDialog
  };
};
