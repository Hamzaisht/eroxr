import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function Eroboard() {
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalSubscribers: 0,
    totalViews: 0,
    engagementRate: 0,
    revenueShare: 0.92, // 100% - 8% platform fee
  });
  const [engagementData, setEngagementData] = useState([]);
  const [earningsData, setEarningsData] = useState([]);

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

        // Calculate total earnings
        const totalEarnings = earningsData?.reduce((sum, item) => sum + item.amount, 0) || 0;
        const subscriberCount = subscribersData?.length || 0;

        setStats(prev => ({
          ...prev,
          totalEarnings: totalEarnings * stats.revenueShare, // Apply 92% revenue share
          totalSubscribers: subscriberCount,
        }));

        // Fetch engagement data for the chart (last 7 days)
        const { data: engagementData, error: engagementError } = await supabase
          .from('post_media_actions')
          .select('created_at, action_type')
          .eq('creator_id', session.user.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (engagementError) throw engagementError;

        // Process engagement data for chart
        const processedEngagementData = processEngagementData(engagementData);
        setEngagementData(processedEngagementData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session?.user?.id]);

  const processEngagementData = (data) => {
    // Process the raw data into a format suitable for charts
    // This is a simplified example - you would want to group by day and count actions
    const grouped = data.reduce((acc, item) => {
      const date = new Date(item.created_at).toLocaleDateString();
      if (!acc[date]) acc[date] = { date, count: 0 };
      acc[date].count++;
      return acc;
    }, {});

    return Object.values(grouped);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-luxury-primary">Creator Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-luxury-neutral/70">Total Earnings</h3>
            <p className="text-2xl font-bold text-luxury-primary">
              ${stats.totalEarnings.toFixed(2)}
            </p>
            <span className="text-xs text-luxury-neutral/50">After 8% platform fee</span>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-luxury-neutral/70">Subscribers</h3>
            <p className="text-2xl font-bold text-luxury-primary">{stats.totalSubscribers}</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-luxury-neutral/70">Total Views</h3>
            <p className="text-2xl font-bold text-luxury-primary">{stats.totalViews}</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-luxury-neutral/70">Engagement Rate</h3>
            <p className="text-2xl font-bold text-luxury-primary">
              {stats.engagementRate.toFixed(1)}%
            </p>
          </Card>
        </div>

        {/* Engagement Chart */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-bold mb-6">Engagement Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8884d8" 
                  name="Interactions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue Chart */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Revenue Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}