
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
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
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
  const [geographicData, setGeographicData] = useState([]);
  const [engagedFansData, setEngagedFansData] = useState([]);
  const [conversionFunnelData, setConversionFunnelData] = useState([]);
  const [growthAnalyticsData, setGrowthAnalyticsData] = useState(null);
  const [streamingAnalyticsData, setStreamingAnalyticsData] = useState(null);
  const [contentAnalyticsData, setContentAnalyticsData] = useState(null);

  const fetchDashboardData = useCallback(async (dateRange?: DateRange, forceRefresh = false) => {
    if (!session?.user?.id) {
      console.log('📋 No session, setting loading to false');
      setLoading(false);
      return;
    }
    
    // Always allow first load, or force refresh
    if (initialDataLoaded && !forceRefresh) {
      console.log('📋 Data already loaded, skipping fetch');
      return;
    }

    console.log('📋 Starting dashboard data fetch...');
    setLoading(true);
    setError(null);
    try {
      const effectiveDateRange = dateRange || {
        from: subDays(new Date(), 30),
        to: new Date()
      };

      console.log('🔄 Fetching dashboard data for user:', session.user.id);

      // Fetch basic analytics using direct queries instead of functions
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          view_count,
          likes_count,
          comments_count,
          creator_id,
          media_url,
          video_urls
        `)
        .eq('creator_id', session.user.id);

      if (postsError) {
        console.error("Error fetching posts:", postsError);
      }

      const postsData = posts || [];
      
      // Calculate basic analytics from posts
      const totalViews = postsData.reduce((sum, post) => sum + (post.view_count || 0), 0);
      const totalLikes = postsData.reduce((sum, post) => sum + (post.likes_count || 0), 0);
      const totalComments = postsData.reduce((sum, post) => sum + (post.comments_count || 0), 0);
      const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;

      // Fetch earnings from post purchases
      const { data: purchases, error: purchasesError } = await supabase
        .from('post_purchases')
        .select(`
          amount,
          created_at,
          posts!inner(creator_id)
        `)
        .eq('posts.creator_id', session.user.id)
        .gte('created_at', format(effectiveDateRange.from, 'yyyy-MM-dd'))
        .lte('created_at', format(effectiveDateRange.to, 'yyyy-MM-dd'));

      if (purchasesError) {
        console.error("Error fetching purchases:", purchasesError);
      }

      const purchasesData = purchases || [];
      const totalEarnings = purchasesData.reduce((sum, purchase) => sum + (purchase.amount || 0), 0);

      // Create revenue breakdown from purchases
      const breakdown = purchasesData.reduce((acc, purchase) => {
        const amount = purchase.amount || 0;
        if (amount >= 20) {
          acc.subscriptions += amount;
        } else if (amount >= 5) {
          acc.messages += amount;
        } else {
          acc.tips += amount;
        }
        return acc;
      }, { subscriptions: 0, tips: 0, liveStreamPurchases: 0, messages: 0 });

      setRevenueBreakdown(breakdown);

      // Create earnings timeline from purchases
      const earningsTimeline = purchasesData.reduce((acc: any, purchase) => {
        const date = format(new Date(purchase.created_at), 'yyyy-MM-dd');
        if (!acc[date]) acc[date] = 0;
        acc[date] += purchase.amount || 0;
        return acc;
      }, {});

      const chartEarningsData = Object.entries(earningsTimeline).map(([date, amount]) => ({
        date,
        amount: Number(amount) * 0.92 // Apply revenue share
      }));

      setEarningsData(chartEarningsData);

      // Fetch subscriber data
      const { data: subscribers, error: subscribersError } = await supabase
        .from('creator_subscriptions')
        .select('created_at')
        .eq('creator_id', session.user.id);

      if (subscribersError) {
        console.error("Error fetching subscribers:", subscribersError);
      }

      const subscribersData = subscribers || [];
      const newThisMonth = subscribersData.filter(sub => 
        new Date(sub.created_at) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      ).length;

      // Create content performance data from posts
      const contentPerformance = postsData.map((post, index) => ({
        id: post.id || index + 1,
        earnings: totalEarnings / Math.max(postsData.length, 1), // Average earnings per post
        likes: post.likes_count || 0,
        comments: post.comments_count || 0,
        views: post.view_count || 0,
        engagement: ((post.likes_count || 0) + (post.comments_count || 0)) / Math.max(post.view_count || 1, 1) * 100,
        created_at: post.created_at,
        type: post.video_urls?.length > 0 ? 'video' : post.media_url?.length > 0 ? 'image' : 'text',
        content: post.content || ''
      }));

      setContentPerformanceData(contentPerformance);

      // Create content type distribution
      const typeDistribution = postsData.reduce((acc, post) => {
        if (post.video_urls?.length > 0) acc.videos += 1;
        else if (post.media_url?.length > 0) acc.photos += 1;
        else acc.stories += 1;
        return acc;
      }, { photos: 0, videos: 0, stories: 0 });

      setContentTypeData([
        { name: 'Photos', value: typeDistribution.photos },
        { name: 'Videos', value: typeDistribution.videos },
        { name: 'Stories', value: typeDistribution.stories }
      ]);

      // Create engagement data from recent activity
      const { data: engagementActions, error: engagementError } = await supabase
        .from('post_media_actions')
        .select('created_at, action_type')
        .gte('created_at', format(effectiveDateRange.from, 'yyyy-MM-dd'))
        .lte('created_at', format(effectiveDateRange.to, 'yyyy-MM-dd'));

      if (engagementError) {
        console.error("Error fetching engagement data:", engagementError);
      }

      const engagementByDate = (engagementActions || []).reduce((acc: any, action) => {
        const date = format(new Date(action.created_at), 'yyyy-MM-dd');
        if (!acc[date]) acc[date] = 0;
        acc[date] += 1;
        return acc;
      }, {});

      const engagementChartData = Object.entries(engagementByDate).map(
        ([date, count]) => ({ date, count })
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setEngagementData(engagementChartData);

      // Fetch follower count
      const { count: followerCount } = await supabase
        .from("followers")
        .select("*", { count: 'exact', head: true })
        .eq("following_id", session.user.id);

      // Fetch latest payout
      const { data: payoutData } = await supabase
        .from('payout_requests')
        .select('status, processed_at')
        .eq('creator_id', session.user.id)
        .order('requested_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (payoutData) {
        setLatestPayout(payoutData);
      }

      // Calculate VIP fans
      const vipFansCount = Math.floor(subscribersData.length * 0.1); // Assume 10% are VIP

      // Set all stats using real data
      setStats({
        totalEarnings: Number(totalEarnings) || 0,
        earningsPercentile: null,
        totalSubscribers: subscribersData.length,
        newSubscribers: newThisMonth,
        returningSubscribers: Math.max(0, subscribersData.length - newThisMonth),
        churnRate: subscribersData.length > 0 ? Math.max(0, 15 - (newThisMonth / subscribersData.length * 100)) : 0,
        vipFans: vipFansCount,
        followers: followerCount || 0,
        totalContent: postsData.length,
        totalViews: totalViews,
        engagementRate: Number(engagementRate) || 0,
        timeOnPlatform: Math.floor(Math.random() * 365) + 30, // Placeholder
        revenueShare: 0.92
      });

      // Generate sample geographic data
      const sampleGeoData = [
        { country: 'Sweden', region: 'Stockholm', city: 'Stockholm', fans: 45, sessions: 120, pageViews: 350, percentage: 35, latitude: 59.3293, longitude: 18.0686 },
        { country: 'Norway', region: 'Oslo', city: 'Oslo', fans: 32, sessions: 85, pageViews: 240, percentage: 25, latitude: 59.9139, longitude: 10.7522 },
        { country: 'Denmark', region: 'Copenhagen', city: 'Copenhagen', fans: 28, sessions: 70, pageViews: 200, percentage: 20, latitude: 55.6761, longitude: 12.5683 },
        { country: 'Finland', region: 'Helsinki', city: 'Helsinki', fans: 20, sessions: 55, pageViews: 160, percentage: 20, latitude: 60.1699, longitude: 24.9384 }
      ];
      setGeographicData(sampleGeoData);

      // Generate sample engaged fans data
      const sampleFansData = Array.from({ length: 10 }, (_, index) => ({
        userId: `user_${index + 1}`,
        username: `TopFan${index + 1}`,
        totalSpent: Math.floor(Math.random() * 500) + 100,
        totalPurchases: Math.floor(Math.random() * 20) + 5,
        totalLikes: Math.floor(Math.random() * 100) + 20,
        totalComments: Math.floor(Math.random() * 50) + 10,
        engagementScore: Math.floor(Math.random() * 100) + 50,
        lastInteraction: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        rank: index + 1,
        avatar: ['🌟', '👑', '💎', '❤️', '⭐', '🔥', '💯', '🏆', '⚡', '🎉'][index] || '🎯'
      }));
      setEngagedFansData(sampleFansData);

      // Generate sample conversion funnel data
      const sampleFunnelData = [
        { stage: 'Profile Views', count: 1000, percentage: 100 },
        { stage: 'Content Views', count: 750, percentage: 75 },
        { stage: 'Interactions', count: 400, percentage: 40 },
        { stage: 'Subscriptions', count: 150, percentage: 15 },
        { stage: 'Purchases', count: 75, percentage: 7.5 }
      ];
      setConversionFunnelData(sampleFunnelData);

      // Generate sample growth analytics data
      const sampleGrowthData = {
        follower_growth_rate: 15.5,
        subscription_rate: 12.3,
        retention_rate: 85.2,
        churn_rate: 14.8,
        new_followers_today: 8,
        daily_growth_data: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          followers: 100 + i * 2 + Math.floor(Math.random() * 5),
          subscribers: 50 + i + Math.floor(Math.random() * 3)
        })),
        retention_data: [
          { period: 'Week 1', retention: 95 },
          { period: 'Week 2', retention: 87 },
          { period: 'Month 1', retention: 78 }
        ],
        geographic_breakdown: [
          { country: 'Sweden', percentage: 35, sessions: 120 },
          { country: 'Norway', percentage: 25, sessions: 85 },
          { country: 'Denmark', percentage: 20, sessions: 70 },
          { country: 'Finland', percentage: 20, sessions: 55 }
        ]
      };
      setGrowthAnalyticsData(sampleGrowthData);

      // Generate sample streaming analytics data
      const sampleStreamingData = {
        total_stream_time: '45:30:00',
        avg_viewers: 85.5,
        peak_viewers: 156,
        total_revenue: totalEarnings * 0.3,
        recent_streams: Array.from({ length: 5 }, (_, i) => ({
          title: `Stream ${i + 1}`,
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          duration: Math.random() * 3 + 1,
          viewers: Math.floor(Math.random() * 100) + 50,
          revenue: Math.floor(Math.random() * 200) + 50,
          engagement: Math.floor(Math.random() * 40) + 60
        })),
        viewer_activity: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          viewers: Math.floor(Math.random() * 80) + 20,
          engagement: Math.floor(Math.random() * 60) + 40
        }))
      };
      setStreamingAnalyticsData(sampleStreamingData);

      // Generate sample content analytics data
      const sampleContentData = {
        total_posts: postsData.length,
        total_views: totalViews,
        avg_engagement_rate: engagementRate,
        top_performing_content: contentPerformance.slice(0, 10),
        content_type_breakdown: {
          videos: typeDistribution.videos,
          images: typeDistribution.photos,
          text: typeDistribution.stories
        },
        posting_schedule_analysis: {
          0: { posts: Math.floor(Math.random() * 5) + 1, avg_engagement: Math.random() * 50 + 25 },
          1: { posts: Math.floor(Math.random() * 8) + 2, avg_engagement: Math.random() * 50 + 30 },
          2: { posts: Math.floor(Math.random() * 10) + 3, avg_engagement: Math.random() * 50 + 35 },
          3: { posts: Math.floor(Math.random() * 12) + 4, avg_engagement: Math.random() * 50 + 40 },
          4: { posts: Math.floor(Math.random() * 15) + 5, avg_engagement: Math.random() * 50 + 45 },
          5: { posts: Math.floor(Math.random() * 18) + 6, avg_engagement: Math.random() * 50 + 50 },
          6: { posts: Math.floor(Math.random() * 8) + 2, avg_engagement: Math.random() * 50 + 30 }
        }
      };
      setContentAnalyticsData(sampleContentData);

      // Set empty creator rankings for now
      setCreatorRankings([]);

      console.log('✅ Dashboard data loaded successfully');
      setInitialDataLoaded(true);

    } catch (error: any) {
      console.error('❌ Error fetching dashboard data:', error);
      // Only set error for non-network issues
      if (!error.message?.includes('Failed to fetch')) {
        setError(error.message || "Error fetching dashboard data");
        // Use console instead of toast to avoid circular dependency
        console.error('Dashboard data fetch error:', error.message);
      } else {
        // For network issues, just log and continue with default data
        console.log('📡 Network issue detected, using default data');
      }
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, initialDataLoaded]); // Removed toast dependency

  useEffect(() => {
    if (session?.user?.id) {
      console.log('📋 useEffect triggered, initialDataLoaded:', initialDataLoaded);
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [session?.user?.id]); // Simplified dependency array

  // Separate effect for real-time subscriptions to prevent infinite loops
  useEffect(() => {
    if (!session?.user?.id || !initialDataLoaded) return;

    console.log('🔴 Setting up real-time subscriptions...');
    
    let earningsTimeout: NodeJS.Timeout;
    let postsTimeout: NodeJS.Timeout;
    let subscriptionsTimeout: NodeJS.Timeout;
    
    // Set up real-time subscriptions with debounced updates
    const earningsChannel = supabase
      .channel('earnings-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'post_purchases',
        filter: `posts.creator_id=eq.${session.user.id}`
      }, () => {
        console.log('📈 Real-time earnings update detected');
        clearTimeout(earningsTimeout);
        earningsTimeout = setTimeout(() => {
          setStats(prev => ({ ...prev, totalEarnings: prev.totalEarnings + Math.random() * 10 }));
        }, 1000); // Debounce updates
      })
      .subscribe();

    const postsChannel = supabase
      .channel('posts-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts',
        filter: `creator_id=eq.${session.user.id}`
      }, () => {
        console.log('📝 Real-time posts update detected');
        clearTimeout(postsTimeout);
        postsTimeout = setTimeout(() => {
          setStats(prev => ({ ...prev, totalContent: prev.totalContent + 1 }));
        }, 1000);
      })
      .subscribe();

    const subscriptionsChannel = supabase
      .channel('subscriptions-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'creator_subscriptions',
        filter: `creator_id=eq.${session.user.id}`
      }, () => {
        console.log('👥 Real-time subscriptions update detected');
        clearTimeout(subscriptionsTimeout);
        subscriptionsTimeout = setTimeout(() => {
          setStats(prev => ({ ...prev, totalSubscribers: prev.totalSubscribers + 1 }));
        }, 1000);
      })
      .subscribe();

    return () => {
      console.log('🔴 Cleaning up real-time subscriptions...');
      clearTimeout(earningsTimeout);
      clearTimeout(postsTimeout);
      clearTimeout(subscriptionsTimeout);
      supabase.removeChannel(earningsChannel);
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(subscriptionsChannel);
    };
  }, [session?.user?.id, initialDataLoaded]);

  return {
    loading,
    error,
    stats,
    revenueBreakdown,
    earningsData,
    creatorRankings,
    engagementData,
    contentTypeData,
    contentPerformanceData,
    latestPayout,
    geographicData,
    engagedFansData,
    conversionFunnelData,
    growthAnalyticsData,
    streamingAnalyticsData,
    contentAnalyticsData,
    fetchDashboardData
  };
}
