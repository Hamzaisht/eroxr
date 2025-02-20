import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PayoutRequestDialog } from "@/components/dashboard/PayoutRequestDialog";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

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

  const fetchDashboardData = async () => {
    if (!session?.user?.id) return;

    try {
      // Fetch total earnings from PPV content by joining posts and post_purchases
      const { data: earningsData, error: earningsError } = await supabase
        .from('posts')
        .select(`
          id,
          post_purchases!inner (
            amount
          )
        `)
        .eq('creator_id', session.user.id);

      if (earningsError) throw earningsError;

      // Calculate total earnings from post purchases
      const totalEarnings = earningsData?.reduce((sum, post) => {
        const purchases = post.post_purchases || [];
        return sum + purchases.reduce((postSum: number, purchase: any) => postSum + (purchase.amount || 0), 0);
      }, 0) || 0;

      // Fetch subscriber count
      const { data: subscribersData, error: subscribersError } = await supabase
        .from('creator_subscriptions')
        .select('id')
        .eq('creator_id', session.user.id);

      if (subscribersError) throw subscribersError;

      // Fetch followers count
      const { data: followersData, error: followersError } = await supabase
        .from('followers')
        .select('id')
        .eq('following_id', session.user.id);

      if (followersError) throw followersError;

      const subscriberCount = subscribersData?.length || 0;
      const followerCount = followersData?.length || 0;

      // Calculate engagement rate as a number
      const engagementRate = followerCount > 0 
        ? Number(((subscriberCount / followerCount) * 100).toFixed(1))
        : 0;

      setStats(prev => ({
        ...prev,
        totalEarnings: totalEarnings * stats.revenueShare,
        totalSubscribers: subscriberCount,
        followers: followerCount,
        engagementRate
      }));

      // Mock data for content types (replace with real data)
      setContentTypeData([
        { name: 'Photos', value: 35 },
        { name: 'Videos', value: 45 },
        { name: 'Stories', value: 20 }
      ]);

      // Fetch latest payout status
      const { data: latestPayoutData, error: payoutError } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('creator_id', session.user.id)
        .order('requested_at', { ascending: false })
        .limit(1)
        .single();

      if (!payoutError) {
        setLatestPayout(latestPayoutData);
      }

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
