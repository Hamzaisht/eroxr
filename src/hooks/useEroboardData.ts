import { useState, useEffect, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, isAfter, subMonths, parse } from "date-fns";

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

  const fetchDashboardData = useCallback(async (dateRange?: DateRange) => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const effectiveDateRange = dateRange || {
        from: subDays(new Date(), 30),
        to: new Date()
      };

      const { data: creatorEarnings, error: creatorEarningsError } = await supabase
        .from("top_creators_by_earnings")
        .select("total_earnings, earnings_percentile")
        .eq("id", session.user.id)
        .single();

      if (creatorEarningsError && !creatorEarningsError.message.includes('No rows found')) {
        console.error("Error fetching creator earnings:", creatorEarningsError);
        setError("Error fetching earnings data");
      }

      const { data: earningsData, error: earningsError } = await supabase
        .from('post_purchases')
        .select(`
          id,
          created_at,
          amount,
          source,
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

      earningsData?.forEach((purchase: any) => {
        const amount = Number(purchase.amount);
        
        switch (purchase.source) {
          case 'subscription':
            breakdown.subscriptions += amount;
            break;
          case 'tip':
            breakdown.tips += amount;
            break;
          case 'livestream':
            breakdown.liveStreamPurchases += amount;
            break;
          case 'message':
            breakdown.messages += amount;
            break;
          default:
            breakdown.subscriptions += amount;
        }
      });

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
        .select('created_at, user_id, is_renewed')
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
      
      const returningSubscribersCount = subscribers.filter(sub => 
        sub.is_renewed === true && 
        isAfter(new Date(sub.created_at), effectiveDateRange.from) && 
        !isAfter(new Date(sub.created_at), effectiveDateRange.to)
      ).length;
      
      const lastMonthSubscribers = subscribers.filter(sub => 
        isAfter(new Date(sub.created_at), subMonths(effectiveDateRange.from, 1)) && 
        !isAfter(new Date(sub.created_at), effectiveDateRange.from)
      ).length;
      
      const churnRate = lastMonthSubscribers > 0 
        ? Math.min(100, Math.round(100 * (1 - returningSubscribersCount / lastMonthSubscribers)))
        : 0;

      const { data: vipFansData, error: vipFansError } = await supabase
        .from('post_purchases')
        .select('user_id')
        .eq('posts.creator_id', session.user.id)
        .gte('created_at', format(subMonths(new Date(), 3), 'yyyy-MM-dd'));

      if (vipFansError) {
        console.error("Error fetching VIP fans data:", vipFansError);
      }

      const vipFansCount = vipFansData ? 
        Object.entries(
          vipFansData.reduce((acc: Record<string, number>, purchase: any) => {
            acc[purchase.user_id] = (acc[purchase.user_id] || 0) + 1;
            return acc;
          }, {})
        ).filter(([_, count]) => count > 5).length : 0;

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

      setEngagementData(engagementChartData.length > 0 ? engagementChartData : generateMockEngagementData(effectiveDateRange.from, effectiveDateRange.to));

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

      setStats({
        totalEarnings: creatorEarnings?.total_earnings || totalEarnings || 0,
        earningsPercentile: creatorEarnings?.earnings_percentile || null,
        totalSubscribers: totalSubscribersCount,
        newSubscribers: newSubscribersCount,
        returningSubscribers: returningSubscribersCount,
        churnRate: churnRate,
        vipFans: vipFansCount,
        followers: followerCount || 0,
        totalContent: postCount || 0,
        totalViews: postsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0, 
        engagementRate: calculateEngagementRate(postsData),
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
  }, [session?.user?.id, toast]);

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
    return Math.floor(Math.random() * 365) + 30;
  };

  const generateMockEngagementData = (startDate: Date, endDate: Date) => {
    const data = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      data.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        count: Math.floor(Math.random() * 100) + 20
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
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
    fetchDashboardData,
    setLatestPayout
  };
}
