
import { useState, useEffect, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { DateRange, EroboardStats, RevenueBreakdown } from "./eroboard/types";
import { useEarningsData } from "./eroboard/useEarningsData";
import { useSubscriberData } from "./eroboard/useSubscriberData";
import { useContentData } from "./eroboard/useContentData";
import { usePayoutData } from "./eroboard/usePayoutData";
import { useCreatorStats } from "./eroboard/useCreatorStats";
import { calculateEngagementRate, calculateTimeOnPlatform } from "./eroboard/utils";
import { subDays } from "date-fns";

export { EroboardStats, RevenueBreakdown, DateRange, PayoutInfo } from "./eroboard/types";

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

  const { 
    earningsData, 
    revenueBreakdown, 
    fetchEarningsData 
  } = useEarningsData();
  
  const { 
    fetchSubscriberData, 
    fetchVipFansData 
  } = useSubscriberData();
  
  const {
    engagementData,
    contentTypeData,
    contentPerformanceData,
    fetchContentData
  } = useContentData();
  
  const {
    latestPayout,
    setLatestPayout,
    fetchPayoutData
  } = usePayoutData();
  
  const {
    fetchCreatorStats
  } = useCreatorStats();

  const fetchDashboardData = useCallback(async (dateRange?: DateRange) => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const effectiveDateRange = dateRange || {
        from: subDays(new Date(), 30),
        to: new Date()
      };

      // Fetch creator stats (earnings, percentile, followers)
      const creatorStats = await fetchCreatorStats();
      
      // Fetch earnings data
      const earningsResult = await fetchEarningsData(effectiveDateRange, stats.revenueShare);
      
      // Fetch subscriber data
      const subscriberData = await fetchSubscriberData(effectiveDateRange);
      
      // Fetch VIP fans data
      const vipFansCount = await fetchVipFansData();
      
      // Fetch content data
      const contentData = await fetchContentData(effectiveDateRange);
      
      // Fetch payout data
      await fetchPayoutData();

      setStats({
        totalEarnings: creatorStats?.totalEarnings || earningsResult?.totalEarnings || 0,
        earningsPercentile: creatorStats?.earningsPercentile || null,
        totalSubscribers: subscriberData?.totalSubscribers || 0,
        newSubscribers: subscriberData?.newSubscribers || 0,
        returningSubscribers: subscriberData?.returningSubscribers || 0,
        churnRate: subscriberData?.churnRate || 0,
        vipFans: vipFansCount || 0,
        followers: creatorStats?.followers || 0,
        totalContent: contentData?.totalContent || 0,
        totalViews: contentData?.totalViews || 0, 
        engagementRate: calculateEngagementRate([]),
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
  }, [
    session?.user?.id, 
    toast, 
    fetchCreatorStats, 
    fetchEarningsData, 
    fetchSubscriberData, 
    fetchVipFansData,
    fetchContentData,
    fetchPayoutData,
    stats.revenueShare
  ]);

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
