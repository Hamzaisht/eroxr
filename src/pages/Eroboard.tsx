import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { ContentDistribution } from "@/components/dashboard/ContentDistribution";
import { RevenueChart } from "@/components/dashboard/RevenueChart";

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.id) return;

      try {
        // Fetch total earnings from PPV content and subscriptions
        const { data: earningsData, error: earningsError } = await supabase
          .from('post_purchases')
          .select('amount')
          .eq('creator_id', session.user.id);

        if (earningsError) throw earningsError;

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

        // Calculate total earnings
        const totalEarnings = earningsData?.reduce((sum, item) => sum + item.amount, 0) || 0;
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

    fetchDashboardData();
  }, [session?.user?.id, toast]);

  const handleRequestPayout = () => {
    toast({
      title: "Payout Requested",
      description: "Your payout request has been submitted and will be processed within 2 weeks.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-luxury-primary">Creator Dashboard</h1>
        <Button 
          onClick={handleRequestPayout}
          className="bg-luxury-primary hover:bg-luxury-primary/90"
        >
          Request Payout
        </Button>
      </div>
      
      <StatsOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <EngagementChart data={engagementData} />
        <ContentDistribution data={contentTypeData} />
      </div>

      <RevenueChart data={earningsData} />
    </div>
  );
}