
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfMonth } from "date-fns";

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
    earningsPercentile: null
  });
  const [engagementData, setEngagementData] = useState([]);
  const [earningsData, setEarningsData] = useState([]);
  const [contentTypeData, setContentTypeData] = useState([]);
  const [latestPayout, setLatestPayout] = useState<PayoutInfo | null>(null);

  const fetchDashboardData = async (dateRange?: DateRange) => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      
      // Set default date range if not provided
      const effectiveDateRange = dateRange || {
        from: subDays(new Date(), 30),
        to: new Date()
      };

      // Fetch creator's earnings information
      const { data: creatorEarnings, error: creatorEarningsError } = await supabase
        .from("top_creators_by_earnings")
        .select("total_earnings, earnings_percentile")
        .eq("id", session.user.id)
        .single();

      if (creatorEarningsError && !creatorEarningsError.message.includes('No rows found')) {
        console.error("Error fetching creator earnings:", creatorEarningsError);
      }

      // Fetch total earnings for the selected date range
      const { data: earningsData, error: earningsError } = await supabase
        .from('posts')
        .select(`
          id,
          created_at,
          post_purchases!inner (
            amount,
            created_at
          )
        `)
        .eq('creator_id', session.user.id)
        .gte('created_at', format(effectiveDateRange.from, 'yyyy-MM-dd'))
        .lte('created_at', format(effectiveDateRange.to, 'yyyy-MM-dd'));

      if (earningsError) {
        console.error("Error fetching earnings data:", earningsError);
      }

      // Process earnings data for chart
      const processedEarningsData = earningsData?.reduce((acc: any, post) => {
        const purchases = post.post_purchases || [];
        purchases.forEach((purchase: any) => {
          const date = format(new Date(purchase.created_at), 'yyyy-MM-dd');
          acc[date] = (acc[date] || 0) + purchase.amount;
        });
        return acc;
      }, {}) || {};

      // Convert to array format for chart
      const chartEarningsData = Object.entries(processedEarningsData).map(
        ([date, amount]) => ({
          date,
          amount: Number(amount) * stats.revenueShare
        })
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setEarningsData(chartEarningsData);

      // Calculate total earnings
      const totalEarnings = chartEarningsData.reduce((sum, item) => sum + Number(item.amount), 0);

      // Fetch subscribers count with proper grouping
      const { count: subscribersCount, error: subscribersError } = await supabase
        .from('creator_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', session.user.id)
        .gte('created_at', format(effectiveDateRange.from, 'yyyy-MM-dd'))
        .lte('created_at', format(effectiveDateRange.to, 'yyyy-MM-dd'));

      if (subscribersError) {
        console.error("Error fetching subscriber count:", subscribersError);
      }

      // Fetch content distribution data
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('media_url, video_urls, created_at')
        .eq('creator_id', session.user.id)
        .gte('created_at', format(effectiveDateRange.from, 'yyyy-MM-dd'))
        .lte('created_at', format(effectiveDateRange.to, 'yyyy-MM-dd'));

      if (postsError) {
        console.error("Error fetching posts data:", postsError);
      }

      // Calculate content distribution
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

      // Fetch engagement data
      const mockEngagementData = generateMockEngagementData(effectiveDateRange.from, effectiveDateRange.to);
      setEngagementData(mockEngagementData);

      // Fetch latest payout data
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

      // Fetch follower count
      const { count: followerCount, error: followerError } = await supabase
        .from("followers")
        .select("*", { count: 'exact', head: true })
        .eq("following_id", session.user.id);

      if (followerError) {
        console.error("Error fetching follower count:", followerError);
      }

      // Fetch total posts count
      const { count: postCount, error: postCountError } = await supabase
        .from("posts")
        .select("*", { count: 'exact', head: true })
        .eq("creator_id", session.user.id);

      if (postCountError) {
        console.error("Error fetching post count:", postCountError);
      }

      // Update stats with all fetched data
      setStats(prev => ({
        ...prev,
        totalEarnings: creatorEarnings?.total_earnings || totalEarnings || 0,
        earningsPercentile: creatorEarnings?.earnings_percentile || null,
        totalSubscribers: subscribersCount || 0,
        followers: followerCount || 0,
        totalContent: postCount || 0,
        totalViews: Math.floor(Math.random() * 10000) + 5000, // Placeholder for now
        engagementRate: Math.floor(Math.random() * 15) + 5 // Placeholder for now
      }));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: "destructive",
        title: "Error fetching dashboard data",
        description: "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate mock engagement data until we have real data
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
  }, [session?.user?.id]);

  return {
    loading,
    stats,
    engagementData,
    earningsData,
    contentTypeData,
    latestPayout,
    fetchDashboardData,
    setLatestPayout
  };
}
