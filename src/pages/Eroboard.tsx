import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Loader2, TrendingUp, Users, Eye, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { ContentDistribution } from "@/components/dashboard/ContentDistribution";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { PayoutRequestDialog } from "@/components/dashboard/PayoutRequestDialog";
import { motion } from "framer-motion";

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

  useEffect(() => {
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

    const fetchLatestPayout = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('creator_id', session.user.id)
        .order('requested_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching payout status:', error);
      }

      if (data) {
        setLatestPayout(data);
      }
    };

    fetchDashboardData();
    fetchLatestPayout();
  }, [session?.user?.id, toast]);

  const handleRequestPayout = () => {
    toast({
      title: "Payout Requested",
      description: "Your payout request has been submitted and will be processed within 2 weeks.",
    });
  };

  const handlePayoutSuccess = () => {
    // Refresh payout status
    fetchDashboardData();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Earnings",
      value: `$${stats.totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      trend: "+12.5%",
      color: "bg-green-500/10 text-green-500"
    },
    {
      title: "Subscribers",
      value: stats.totalSubscribers.toString(),
      icon: Users,
      trend: "+5.2%",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "Engagement Rate",
      value: `${stats.engagementRate}%`,
      icon: TrendingUp,
      trend: "+8.1%",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: "Total Views",
      value: "12.5K",
      icon: Eye,
      trend: "+15.3%",
      color: "bg-pink-500/10 text-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Creator Dashboard
            </h1>
            <p className="text-luxury-muted mt-1">
              Track your performance and earnings
            </p>
          </div>
          <div className="flex items-center gap-4">
            {latestPayout && (
              <span className="text-sm text-luxury-muted">
                {getPayoutStatusText()}
              </span>
            )}
            <Button 
              onClick={() => setPayoutDialogOpen(true)}
              className="bg-luxury-primary hover:bg-luxury-primary/90"
              disabled={latestPayout?.status === 'pending'}
            >
              Request Payout
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 hover:scale-105 transition-transform duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-sm text-green-500">{stat.trend}</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-luxury-muted text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Engagement Overview</h2>
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <EngagementChart data={engagementData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Content Distribution</h2>
              <Button variant="ghost" size="sm">
                Last 30 Days
              </Button>
            </div>
            <ContentDistribution data={contentTypeData} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Revenue Analytics</h2>
            <Button variant="ghost" size="sm">
              This Month
            </Button>
          </div>
          <RevenueChart data={earningsData} />
        </motion.div>

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
