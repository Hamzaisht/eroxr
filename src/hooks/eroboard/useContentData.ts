
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import type { DateRange } from "./types";
import { generateMockEngagementData } from "./utils";

export function useContentData() {
  const session = useSession();
  const [engagementData, setEngagementData] = useState([]);
  const [contentTypeData, setContentTypeData] = useState([]);
  const [contentPerformanceData, setContentPerformanceData] = useState([]);

  const fetchContentData = useCallback(async (dateRange: DateRange) => {
    if (!session?.user?.id) return null;

    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select(`
        id, 
        media_url, 
        video_urls, 
        created_at, 
        likes_count, 
        comments_count, 
        view_count,
        earnings:post_purchases(amount)
      `)
      .eq('creator_id', session.user.id)
      .gte('created_at', format(dateRange.from, 'yyyy-MM-dd'))
      .lte('created_at', format(dateRange.to, 'yyyy-MM-dd'));

    if (postsError) {
      console.error("Error fetching posts data:", postsError);
      return { 
        engagementData: [], 
        contentTypeData: [], 
        contentPerformanceData: [], 
        totalViews: 0 
      };
    }

    const distribution = postsData?.reduce(
      (acc: { photos: number; videos: number; stories: number }, post) => {
        if (post.media_url?.length) acc.photos += 1;
        if (post.video_urls?.length) acc.videos += 1;
        return acc;
      },
      { photos: 0, videos: 0, stories: 0 }
    );

    const updatedContentTypeData = [
      { name: 'Photos', value: distribution?.photos || 0 },
      { name: 'Videos', value: distribution?.videos || 0 },
      { name: 'Stories', value: distribution?.stories || 0 }
    ];

    setContentTypeData(updatedContentTypeData);

    const contentPerformance = postsData?.map(post => {
      const postEarnings = post.earnings?.reduce((sum: number, purchase: any) => sum + Number(purchase.amount), 0) || 0;
      
      return {
        id: post.id,
        earnings: postEarnings,
        likes: post.likes_count || 0,
        comments: post.comments_count || 0,
        views: post.view_count || 0,
        engagement: (post.likes_count || 0) + (post.comments_count || 0) * 2,
        created_at: post.created_at,
        type: post.video_urls?.length ? 'video' : 'photo'
      };
    }) || [];

    setContentPerformanceData(contentPerformance);

    try {
      const { data: actionsData, error: actionsError } = await supabase
        .from('post_media_actions')
        .select('created_at, action_type')
        .eq('creator_id', session.user.id)
        .gte('created_at', format(dateRange.from, 'yyyy-MM-dd'))
        .lte('created_at', format(dateRange.to, 'yyyy-MM-dd'));

      if (actionsError) {
        throw actionsError;
      }

      const engagementByDate = actionsData?.reduce((acc: any, action) => {
        const date = format(new Date(action.created_at), 'yyyy-MM-dd');
        if (!acc[date]) acc[date] = 0;
        acc[date] += 1;
        return acc;
      }, {}) || {};

      const engagementChartData = Object.entries(engagementByDate).map(
        ([date, count]) => ({ date, count })
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const finalEngagementData = engagementChartData.length > 0 
        ? engagementChartData 
        : generateMockEngagementData(dateRange.from, dateRange.to);
      
      setEngagementData(finalEngagementData);
    } catch (error) {
      console.error("Error fetching engagement data:", error);
      const mockData = generateMockEngagementData(dateRange.from, dateRange.to);
      setEngagementData(mockData);
    }

    const totalViews = postsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

    return { 
      engagementData: engagementData, 
      contentTypeData: updatedContentTypeData, 
      contentPerformanceData: contentPerformance,
      totalViews,
      totalContent: postsData?.length || 0
    };
  }, [session?.user?.id]);

  return {
    engagementData,
    contentTypeData,
    contentPerformanceData,
    fetchContentData
  };
}
