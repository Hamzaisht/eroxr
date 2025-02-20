import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PayoutRequestDialog } from "@/components/dashboard/PayoutRequestDialog";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { format } from "date-fns";

export default function Eroboard() {
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalSubscribers: 0,
    totalViews: 0,
    engagementRate: 0,
    timeOnPlatform: 0,
    revenueShare: 0.92,
    followers: 0,
    totalContent: 0
  });
  const [engagementData, setEngagementData] = useState([]);
  const [earningsData, setEarningsData] = useState([]);
  const [contentTypeData, setContentTypeData] = useState([]);
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [latestPayout, setLatestPayout] = useState<{
    status: string;
    processed_at: string | null;
  } | null>(null);

  const fetchDashboardData = async (dateRange?: { from: Date; to: Date }) => {
    if (!session?.user?.id) return;

    try {
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
        .gte('created_at', dateRange ? format(dateRange.from, 'yyyy-MM-dd') : null)
        .lte('created_at', dateRange ? format(dateRange.to, 'yyyy-MM-dd') : null);

      if (earningsError) throw earningsError;

      // Process earnings data for chart
      const processedEarningsData = earningsData?.reduce((acc: any, post) => {
        const purchases = post.post_purchases || [];
        purchases.forEach((purchase: any) => {
          const date = format(new Date(purchase.created_at), 'yyyy-MM-dd');
          acc[date] = (acc[date] || 0) + purchase.amount;
        });
        return acc;
      }, {});

      // Convert to array format for chart
      const chartEarningsData = Object.entries(processedEarningsData || {}).map(
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
        .gte('created_at', dateRange ? format(dateRange.from, 'yyyy-MM-dd') : null)
        .lte('created_at', dateRange ? format(dateRange.to, 'yyyy-MM-dd') : null);

      if (subscribersError) throw subscribersError;

      // Fetch content distribution data
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('media_url, video_urls, created_at')
        .eq('creator_id', session.user.id)
        .gte('created_at', dateRange ? format(dateRange.from, 'yyyy-MM-dd') : null)
        .lte('created_at', dateRange ? format(dateRange.to, 'yyyy-MM-dd') : null);

      if (postsError) throw postsError;

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

      // Update stats
      setStats(prev => ({
        ...prev,
        totalEarnings,
        totalSubscribers: subscribersCount || 0
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

  useEffect(() => {
    fetchDashboardData();
  }, [session?.user?.id]);

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    fetchDashboardData(range);
  };

  const isPayoutDisabled = () => {
    return latestPayout?.status === 'pending' || stats.totalEarnings < 100;
  };

  const getPayoutButtonTooltip = () => {
    if (latestPayout?.status === 'pending') return 'You have a pending payout request';
    if (stats.totalEarnings < 100) return 'Minimum payout amount is $100';
    return '';
  };

  const getPayoutStatusText = () => {
    if (!latestPayout) return null;

    switch (latestPayout.status) {
      case 'pending':
        return '(Under Review)';
      case 'approved':
        return '(Approved)';
      case 'processed':
        return `(Last Payment: ${new Date(latestPayout.processed_at!).toLocaleDateString()})`;
      default:
        return null;
    }
  };

  const handlePayoutSuccess = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader
          totalEarnings={stats.totalEarnings}
          onRequestPayout={() => setPayoutDialogOpen(true)}
          isPayoutDisabled={isPayoutDisabled()}
          payoutStatus={getPayoutStatusText()}
          payoutTooltip={getPayoutButtonTooltip()}
        />
        
        <StatsCards stats={stats} />
        
        <DashboardCharts
          engagementData={engagementData}
          contentTypeData={contentTypeData}
          earningsData={earningsData}
          onDateRangeChange={handleDateRangeChange}
        />

        <PayoutRequestDialog
          open={payoutDialogOpen}
          onOpenChange={setPayoutDialogOpen}
          totalEarnings={stats.totalEarnings}
          onSuccess={handlePayoutSuccess}
        />
      </div>
    </div>
  );
}
