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

      const [
        postsData,
        likesData,
        commentsData,
        viewsData,
        tipsData,
        messagesData,
        datingViewsData,
        contentTypesData,
      ] = await Promise.all([
        // Posts created by user
        supabase
          .from("posts")
          .select("id, created_at, likes_count, comments_count, view_count")
          .eq("creator_id", userId)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end),
          
        // Likes by user
        supabase
          .from("post_likes")
          .select("id, created_at, posts!inner(creator_id)")
          .eq("user_id", userId)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end),
          
        // Comments by user  
        supabase
          .from("comments")
          .select("id, created_at, posts!inner(creator_id)")
          .eq("user_id", userId)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end),
          
        // Post views (approximate from post_media_actions)
        supabase
          .from("post_media_actions")
          .select("id, created_at, action_type")
          .eq("user_id", userId)
          .eq("action_type", "view")
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end),
          
        // Tips sent by user  
        supabase
          .from("tips")
          .select("id, amount, created_at, recipient_id")
          .eq("sender_id", userId)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end),
          
        // Messages sent by user  
        supabase
          .from("direct_messages")
          .select("id, created_at, message_type, recipient_id")
          .eq("sender_id", userId)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end),
          
        // Dating ad views
        supabase
          .from("dating_ads")
          .select("id, view_count, click_count, created_at")
          .eq("user_id", userId)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end),
          
        // Content type preferences (posts vs dating vs stories)
        supabase
          .from("post_media_actions")
          .select("id, post_id, created_at")
          .eq("user_id", userId)
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end)
      ]);

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
      const profileViewCount: { [key: string]: { count: number, username: string, avatar_url: string | null } } = {};
      
      if (mostViewedProfiles) {
        mostViewedProfiles.forEach((view: any) => {
          const creator = view.posts.creator_id;
          const profile = view.posts.profiles;
          
          if (creator && creator !== userId) { // Don't count self-views
            if (!profileViewCount[creator]) {
              profileViewCount[creator] = { 
                count: 0, 
                username: profile?.username || "Unknown", 
                avatar_url: profile?.avatar_url 
              };
            }
            profileViewCount[creator].count++;
          }
        });
      }
      
      const topProfiles = Object.entries(profileViewCount)
        .map(([id, data]) => ({ 
          id, 
          ...data 
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
        postsData.data?.forEach((post: any) => {
          const dateStr = format(new Date(post.created_at), "yyyy-MM-dd");
          if (timeline[dateStr]) {
            timeline[dateStr].posts++;
          }
        });
        
        // Add like counts to timeline
        likesData.data?.forEach((like: any) => {
          const dateStr = format(new Date(like.created_at), "yyyy-MM-dd");
          if (timeline[dateStr]) {
            timeline[dateStr].likes++;
          }
        });
        
        // Add comment counts to timeline
        commentsData.data?.forEach((comment: any) => {
          const dateStr = format(new Date(comment.created_at), "yyyy-MM-dd");
          if (timeline[dateStr]) {
            timeline[dateStr].comments++;
          }
        });
        
        // Add view counts to timeline
        viewsData.data?.forEach((view: any) => {
          const dateStr = format(new Date(view.created_at), "yyyy-MM-dd");
          if (timeline[dateStr]) {
            timeline[dateStr].views++;
          }
        });
        
        // Add message counts to timeline
        messagesData.data?.forEach((message: any) => {
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
        { name: "Posts", value: postsData.data?.length || 0 },
        { name: "Dating", value: datingViewsData.data?.length || 0 },
        { name: "Messages", value: messagesData.data?.length || 0 }
      ];

      // Calculate total statistics
      const totalPosts = postsData.data?.length || 0;
      const totalLikes = likesData.data?.length || 0; 
      const totalComments = commentsData.data?.length || 0;
      const totalViews = viewsData.data?.length || 0;
      const totalMessages = messagesData.data?.length || 0;
      
      // Calculate tips amount
      const tipsAmount = tipsData.data?.reduce((sum, tip) => sum + (parseFloat(tip.amount) || 0), 0) || 0;
      
      // Get unique recipients
      const uniqueMessageRecipients = new Set(messagesData.data?.map((m: any) => m.recipient_id) || []);
      
      // Get last active date
      const allDates = [
        ...(postsData.data?.map((p: any) => new Date(p.created_at).getTime()) || []),
        ...(likesData.data?.map((l: any) => new Date(l.created_at).getTime()) || []),
        ...(commentsData.data?.map((c: any) => new Date(c.created_at).getTime()) || []),
        ...(viewsData.data?.map((v: any) => new Date(v.created_at).getTime()) || []),
        ...(messagesData.data?.map((m: any) => new Date(m.created_at).getTime()) || [])
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
