
import { useState, useEffect, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, isAfter, subMonths } from "date-fns";

export type EroboardStats = {
  totalEarnings: number;
  totalSubscribers: number;
  totalViews: number;
  engagementRate: number;
  timeOnPlatform: number;
  revenueShare: number;
  followers: number;
  totalContent: number;
  earningsPercentile: number | null;
  newSubscribers: number;
  returningSubscribers: number;
  churnRate: number;
  vipFans: number;
};

export type RevenueBreakdown = {
  subscriptions: number;
  tips: number;
  liveStreamPurchases: number;
  messages: number;
};

export type DateRange = {
  from: Date;
  to: Date;
};

export type PayoutInfo = {
  status: string;
  processed_at: string | null;
};

export function useEroboardData() {
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [stats, setStats] = useState<EroboardStats>({
    totalEarnings: 0,
    totalSubscribers: 0,
    totalViews: 0,
    engagementRate: 0,
    timeOnPlatform: 0,
    revenueShare: 0.92,
    followers: 0,
    totalContent: 0,
    earningsPercentile: null,
    newSubscribers: 0,
    returningSubscribers: 0,
    churnRate: 0,
    vipFans: 0
  });
  const [revenueBreakdown, setRevenueBreakdown] = useState<RevenueBreakdown>({
    subscriptions: 0,
    tips: 0,
    liveStreamPurchases: 0,
    messages: 0
  });
  const [engagementData, setEngagementData] = useState([]);
  const [earningsData, setEarningsData] = useState([]);
  const [contentTypeData, setContentTypeData] = useState([]);
  const [contentPerformanceData, setContentPerformanceData] = useState([]);
  const [latestPayout, setLatestPayout] = useState<PayoutInfo | null>(null);
  const [creatorRankings, setCreatorRankings] = useState([]);

  const fetchDashboardData = useCallback(async (dateRange?: DateRange) => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const effectiveDateRange = dateRange || {
        from: subDays(new Date(), 30),
        to: new Date()
      };

      // Fetch creator rankings from creator_metrics table
      const { data: rankingsData, error: rankingsError } = await supabase
        .from('creator_metrics')
        .select(`
          id,
          user_id,
          followers,
          views,
          engagement_score,
          earnings,
          popularity_score,
          profiles!inner (
            username,
            avatar_url,
            bio
          )
        `)
        .order('popularity_score', { ascending: false })
        .limit(20);

      if (rankingsError) {
        console.error("Error fetching creator rankings:", rankingsError);
        setError("Error fetching creator rankings");
      } else {
        setCreatorRankings(rankingsData || []);
      }

      const { data: creatorEarnings, error: creatorEarningsError } = await supabase
        .from("top_creators_by_earnings")
        .select("total_earnings, earnings_percentile")
        .eq("id", session.user.id)
        .single();

      if (creatorEarningsError && !creatorEarningsError.message.includes('No rows found')) {
        console.error("Error fetching creator earnings:", creatorEarningsError);
        setError("Error fetching earnings data");
      }

      // Fetch actual creator metrics for the current user
      const { data: userMetrics, error: userMetricsError } = await supabase
        .from('creator_metrics')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
        
      if (userMetricsError && !userMetricsError.message.includes('No rows found')) {
        console.error("Error fetching user metrics:", userMetricsError);
      }

      const { data: earningsData, error: earningsError } = await supabase
        .from('post_purchases')
        .select(`
          id,
          created_at,
          amount,
          post_id,
          posts!inner (creator_id)
        `)
        .eq('posts.creator_id', session.user.id)
        .gte('created_at', format(effectiveDateRange.from, 'yyyy-MM-dd'))
        .lte('created_at', format(effectiveDateRange.to, 'yyyy-MM-dd'));

      if (earningsError) {
        console.error("Error fetching earnings data:", earningsError);
        setError("Error fetching earnings breakdown");
      }

      const breakdown: RevenueBreakdown = {
        subscriptions: 0,
        tips: 0,
        liveStreamPurchases: 0,
        messages: 0
      };

      if (earningsData && earningsData.length > 0) {
        earningsData.forEach((purchase: any) => {
          const amount = Number(purchase.amount);
          
          if (amount > 20) {
            breakdown.subscriptions += amount;
          } else if (amount < 5) {
            breakdown.tips += amount;
          } else if (amount >= 10 && amount <= 15) {
            breakdown.liveStreamPurchases += amount;
          } else {
            breakdown.messages += amount;
          }
        });
      }

      setRevenueBreakdown(breakdown);

      const processedEarningsData = earningsData?.reduce((acc: any, purchase: any) => {
        const date = format(new Date(purchase.created_at), 'yyyy-MM-dd');
        acc[date] = (acc[date] || 0) + purchase.amount;
        return acc;
      }, {}) || {};

      const chartEarningsData = Object.entries(processedEarningsData).map(
        ([date, amount]) => ({
          date,
          amount: Number(amount) * stats.revenueShare
        })
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setEarningsData(chartEarningsData);

      const totalEarnings = chartEarningsData.reduce((sum, item) => sum + Number(item.amount), 0);

      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('creator_subscriptions')
        .select('created_at, user_id')
        .eq('creator_id', session.user.id);

      if (subscriptionsError) {
        console.error("Error fetching subscriber data:", subscriptionsError);
        setError("Error fetching subscriber metrics");
      }

      const subscribers = subscriptionsData || [];
      const subscribersInRange = subscribers.filter(sub => {
        const subDate = new Date(sub.created_at);
        return isAfter(subDate, effectiveDateRange.from) && 
               !isAfter(subDate, effectiveDateRange.to);
      });

      const totalSubscribersCount = subscribers.length;
      const newSubscribersCount = subscribersInRange.length;
      
      const userSubscriptionDates = subscribers.reduce((acc: Record<string, Date[]>, sub) => {
        if (!acc[sub.user_id]) acc[sub.user_id] = [];
        acc[sub.user_id].push(new Date(sub.created_at));
        return acc;
      }, {});
      
      const returningSubscribersCount = Object.values(userSubscriptionDates)
        .filter(dates => 
          dates.length > 1 && 
          dates.some(date => 
            isAfter(date, effectiveDateRange.from) && 
            !isAfter(date, effectiveDateRange.to)
          )
        ).length;
      
      const lastMonthSubscribers = subscribers.filter(sub => 
        isAfter(new Date(sub.created_at), subMonths(effectiveDateRange.from, 1)) && 
        !isAfter(new Date(sub.created_at), effectiveDateRange.from)
      ).length;
      
      const previousMonthUsers = new Set();
      const currentMonthUsers = new Set();
      
      subscribers.forEach(sub => {
        const date = new Date(sub.created_at);
        if (isAfter(date, subMonths(effectiveDateRange.from, 1)) && 
            !isAfter(date, effectiveDateRange.from)) {
          previousMonthUsers.add(sub.user_id);
        }
        if (isAfter(date, effectiveDateRange.from) && 
            !isAfter(date, effectiveDateRange.to)) {
          currentMonthUsers.add(sub.user_id);
        }
      });
      
      const renewedUsers = [...previousMonthUsers].filter(id => currentMonthUsers.has(id)).length;
      const churnRate = previousMonthUsers.size > 0 
        ? Math.min(100, Math.round(100 * (1 - renewedUsers / previousMonthUsers.size)))
        : 0;

      const { data: vipFansData, error: vipFansError } = await supabase
        .from('post_purchases')
        .select('user_id')
        .eq('posts.creator_id', session.user.id)
        .gte('created_at', format(subMonths(new Date(), 3), 'yyyy-MM-dd'));

      if (vipFansError) {
        console.error("Error fetching VIP fans data:", vipFansError);
      }

      let vipFansCount = 0;
      
      if (vipFansData && vipFansData.length > 0) {
        const purchasesByUser: Record<string, number> = {};
        
        vipFansData.forEach(purchase => {
          const userId = purchase.user_id;
          purchasesByUser[userId] = (purchasesByUser[userId] || 0) + 1;
        });
        
        vipFansCount = Object.values(purchasesByUser).filter(count => count > 5).length;
      }

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
        .gte('created_at', format(effectiveDateRange.from, 'yyyy-MM-dd'))
        .lte('created_at', format(effectiveDateRange.to, 'yyyy-MM-dd'));

      if (postsError) {
        console.error("Error fetching posts data:", postsError);
        setError("Error fetching content performance data");
      }

      const distribution = postsData?.reduce(
        (acc: { photos: number; videos: number; stories: number }, post) => {
          if (post.media_url?.length) acc.photos += 1;
          if (post.video_urls?.length) acc.videos += 1;
          return acc;
        },
        { photos: 0, videos: 0, stories: 0 }
      );

      setContentTypeData([
        { name: 'Photos', value: distribution?.photos || 0 },
        { name: 'Videos', value: distribution?.videos || 0 },
        { name: 'Stories', value: distribution?.stories || 0 }
      ]);

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

      const { data: engagementActionData, error: engagementError } = await supabase
        .from('post_media_actions')
        .select('created_at, action_type')
        .eq('posts.creator_id', session.user.id)
        .gte('created_at', format(effectiveDateRange.from, 'yyyy-MM-dd'))
        .lte('created_at', format(effectiveDateRange.to, 'yyyy-MM-dd'));

      if (engagementError) {
        console.error("Error fetching engagement data:", engagementError);
      }

      const engagementByDate = engagementActionData?.reduce((acc: any, action) => {
        const date = format(new Date(action.created_at), 'yyyy-MM-dd');
        if (!acc[date]) acc[date] = 0;
        acc[date] += 1;
        return acc;
      }, {}) || {};

      const engagementChartData = Object.entries(engagementByDate).map(
        ([date, count]) => ({ date, count })
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Only use real engagement data if available, otherwise don't use mock data
      setEngagementData(engagementChartData.length > 0 ? engagementChartData : []);

      const { data: payoutData, error: payoutError } = await supabase
        .from('payout_requests')
        .select('status, processed_at')
        .eq('creator_id', session.user.id)
        .order('requested_at', { ascending: false })
        .limit(1)
        .single();

      if (!payoutError) {
        setLatestPayout(payoutData);
      }

      const { count: followerCount, error: followerError } = await supabase
        .from("followers")
        .select("*", { count: 'exact', head: true })
        .eq("following_id", session.user.id);

      if (followerError) {
        console.error("Error fetching follower count:", followerError);
      }

      const { count: postCount, error: postCountError } = await supabase
        .from("posts")
        .select("*", { count: 'exact', head: true })
        .eq("creator_id", session.user.id);

      if (postCountError) {
        console.error("Error fetching post count:", postCountError);
      }

      // Use the userMetrics data if available
      setStats({
        totalEarnings: userMetrics?.earnings || creatorEarnings?.total_earnings || totalEarnings || 0,
        earningsPercentile: creatorEarnings?.earnings_percentile || null,
        totalSubscribers: totalSubscribersCount,
        newSubscribers: newSubscribersCount,
        returningSubscribers: returningSubscribersCount,
        churnRate: churnRate,
        vipFans: vipFansCount,
        followers: userMetrics?.followers || followerCount || 0,
        totalContent: postCount || 0,
        totalViews: userMetrics?.views || postsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0, 
        engagementRate: userMetrics?.engagement_score || calculateEngagementRate(postsData),
        timeOnPlatform: calculateTimeOnPlatform(session.user.id),
        revenueShare: 0.92
      });

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || "Error fetching dashboard data");
      toast({
        variant: "destructive",
        title: "Error fetching dashboard data",
        description: "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, toast, stats.revenueShare]);

  const calculateEngagementRate = (posts: any[] = []) => {
    if (!posts || posts.length === 0) return 0;
    
    const totalEngagements = posts.reduce((sum, post) => {
      return sum + (post.likes_count || 0) + (post.comments_count || 0);
    }, 0);
    
    const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0);
    
    return totalViews > 0 
      ? Math.round((totalEngagements / totalViews) * 100) 
      : 0;
  };

  const calculateTimeOnPlatform = (userId: string) => {
    // This would ideally be calculated from the user's account creation date
    // For now, we'll use the existing approach as a fallback until we have better data
    return Math.floor(Math.random() * 365) + 30;
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardData();
    }
  }, [session?.user?.id, fetchDashboardData]);

  return {
    loading,
    error,
    stats,
    revenueBreakdown,
    engagementData,
    earningsData,
    contentTypeData,
    contentPerformanceData,
    latestPayout,
    creatorRankings,
    fetchDashboardData,
    setLatestPayout
  };
}
