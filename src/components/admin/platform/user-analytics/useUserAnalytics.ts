import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { format, subDays } from "date-fns";
import { Analytics, ViewedProfile } from "./types";

export const useUserAnalytics = (userId: string | undefined, timeRange: string) => {
  // Calculate date range based on selected time period
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, parseInt(timeRange));
    return {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    };
  };

  // Fetch user profile information
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles!inner (
            role
          )
        `)
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }

      return data;
    },
    enabled: !!userId,
  });

  // Fetch user analytics data
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["user-analytics", userId, timeRange],
    queryFn: async () => {
      if (!userId) return null;
      const dateRange = getDateRange();

      // Fetch user analytics data
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("id, created_at, likes_count, comments_count, view_count")
        .eq("creator_id", userId)
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);

      const { data: likesData, error: likesError } = await supabase
        .from("post_likes")
        .select("id, created_at, posts!inner(creator_id)")
        .eq("user_id", userId)
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);

      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("id, created_at, posts!inner(creator_id)")
        .eq("user_id", userId)
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);

      const { data: viewsData, error: viewsError } = await supabase
        .from("post_media_actions")
        .select("id, created_at, action_type")
        .eq("user_id", userId)
        .eq("action_type", "view")
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);

      const { data: tipsData, error: tipsError } = await supabase
        .from("tips")
        .select("id, amount, created_at, recipient_id")
        .eq("sender_id", userId)
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);

      const { data: messagesData, error: messagesError } = await supabase
        .from("direct_messages")
        .select("id, created_at, message_type, recipient_id")
        .eq("sender_id", userId)
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);

      const { data: datingViewsData, error: datingViewsError } = await supabase
        .from("dating_ads")
        .select("id, view_count, click_count, created_at")
        .eq("user_id", userId)
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);

      const { data: contentTypesData, error: contentTypesError } = await supabase
        .from("post_media_actions")
        .select("id, post_id, created_at")
        .eq("user_id", userId)
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);

      // Extract most viewed profiles
      const { data: mostViewedProfiles } = await supabase
        .from("post_media_actions")
        .select(`
          id, 
          created_at,
          posts!inner (
            creator_id,
            profiles!creator_id (
              username,
              avatar_url
            )
          )
        `)
        .eq("user_id", userId)
        .eq("action_type", "view")
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);

      // Process most viewed profiles
      const profileViewCount: { [key: string]: { count: number, username: string, avatar_url: string | null, lastViewed: string } } = {};
      
      if (mostViewedProfiles) {
        mostViewedProfiles.forEach((view: any) => {
          const creator = view.posts.creator_id;
          const profile = view.posts.profiles;
          
          if (creator && creator !== userId) { // Don't count self-views
            if (!profileViewCount[creator]) {
              profileViewCount[creator] = { 
                count: 0, 
                username: profile?.username || "Unknown", 
                avatar_url: profile?.avatar_url,
                lastViewed: view.created_at
              };
            }
            profileViewCount[creator].count++;
            // Update last viewed time if this view is more recent
            if (new Date(view.created_at) > new Date(profileViewCount[creator].lastViewed)) {
              profileViewCount[creator].lastViewed = view.created_at;
            }
          }
        });
      }
      
      // Convert to ViewedProfile[] format to match the required interface
      const topProfiles: ViewedProfile[] = Object.entries(profileViewCount)
        .map(([id, data]) => ({ 
          id,
          viewer_id: userId,
          viewer_username: profile?.username || "Unknown",
          view_count: data.count,
          last_viewed: data.lastViewed,
          username: data.username,
          avatar_url: data.avatar_url,
          count: data.count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Create activity timeline
      const createTimeline = () => {
        // Generate date range array
        const days = parseInt(timeRange);
        const timeline: { [key: string]: any } = {};
        
        for (let i = 0; i < days; i++) {
          const date = subDays(new Date(), i);
          const dateStr = format(date, "yyyy-MM-dd");
          timeline[dateStr] = {
            date: dateStr,
            posts: 0,
            likes: 0,
            comments: 0,
            views: 0,
            messages: 0
          };
        }
        
        // Add post counts to timeline
        postsData?.forEach((post: any) => {
          const dateStr = format(new Date(post.created_at), "yyyy-MM-dd");
          if (timeline[dateStr]) {
            timeline[dateStr].posts++;
          }
        });
        
        // Add like counts to timeline
        likesData?.forEach((like: any) => {
          const dateStr = format(new Date(like.created_at), "yyyy-MM-dd");
          if (timeline[dateStr]) {
            timeline[dateStr].likes++;
          }
        });
        
        // Add comment counts to timeline
        commentsData?.forEach((comment: any) => {
          const dateStr = format(new Date(comment.created_at), "yyyy-MM-dd");
          if (timeline[dateStr]) {
            timeline[dateStr].comments++;
          }
        });
        
        // Add view counts to timeline
        viewsData?.forEach((view: any) => {
          const dateStr = format(new Date(view.created_at), "yyyy-MM-dd");
          if (timeline[dateStr]) {
            timeline[dateStr].views++;
          }
        });
        
        // Add message counts to timeline
        messagesData?.forEach((message: any) => {
          const dateStr = format(new Date(message.created_at), "yyyy-MM-dd");
          if (timeline[dateStr]) {
            timeline[dateStr].messages++;
          }
        });
        
        return Object.values(timeline).reverse();
      };

      const timeline = createTimeline();

      // Calculate content type distribution
      const contentDistribution = [
        { name: "Posts", value: postsData?.length || 0 },
        { name: "Dating", value: datingViewsData?.length || 0 },
        { name: "Messages", value: messagesData?.length || 0 }
      ];

      // Calculate total statistics
      const totalPosts = postsData?.length || 0;
      const totalLikes = likesData?.length || 0; 
      const totalComments = commentsData?.length || 0;
      const totalViews = viewsData?.length || 0;
      const totalMessages = messagesData?.length || 0;
      
      // Calculate tips amount
      const tipsAmount = tipsData?.reduce((sum, tip) => sum + (parseFloat(tip.amount) || 0), 0) || 0;
      
      // Get unique recipients
      const uniqueMessageRecipients = new Set(messagesData?.map((m: any) => m.recipient_id) || []);
      
      // Get last active date
      const allDates = [
        ...(postsData?.map((p: any) => new Date(p.created_at).getTime()) || []),
        ...(likesData?.map((l: any) => new Date(l.created_at).getTime()) || []),
        ...(commentsData?.map((c: any) => new Date(c.created_at).getTime()) || []),
        ...(viewsData?.map((v: any) => new Date(v.created_at).getTime()) || []),
        ...(messagesData?.map((m: any) => new Date(m.created_at).getTime()) || [])
      ];
      
      const lastActiveTimestamp = allDates.length > 0 ? Math.max(...allDates) : null;
      const lastActive = lastActiveTimestamp ? new Date(lastActiveTimestamp) : null;

      // Create the analytics object with all the required fields
      const analytics: Analytics = {
        // Fields for the Analytics type
        posts: totalPosts,
        comments: totalComments,
        likes: totalLikes,
        followers: 0, // Placeholder - we don't have this data yet
        following: 0, // Placeholder - we don't have this data yet
        content_views: totalViews,
        profile_views: 0, // Placeholder - we don't have this data yet
        
        // Fields used in the implementation
        totalPosts,
        totalLikes,
        totalComments,
        totalViews,
        totalMessages,
        tipsAmount,
        uniqueMessageRecipients: uniqueMessageRecipients.size,
        contentDistribution,
        timeline,
        topProfiles,
        lastActive
      };
      
      return analytics;
    },
    enabled: !!userId,
  });

  const isLoading = isProfileLoading || isAnalyticsLoading;

  return {
    profile,
    analytics: analyticsData,
    isLoading
  };
};
