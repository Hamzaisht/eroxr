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
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, DollarSign, Users, Eye, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
    revenueShare: 0.92, // 100% - 8% platform fee
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
          engagementRate // Now storing as a number
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-luxury-primary">Creator Dashboard</h1>
          <Button 
            onClick={handleRequestPayout}
            className="bg-luxury-primary hover:bg-luxury-primary/90"
          >
            Request Payout
          </Button>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-luxury-dark to-luxury-dark/95 border-luxury-primary/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-luxury-primary/10 rounded-full">
                <DollarSign className="h-6 w-6 text-luxury-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-luxury-neutral/70">Total Earnings</h3>
                <p className="text-2xl font-bold text-luxury-primary">
                  ${stats.totalEarnings.toFixed(2)}
                </p>
                <span className="text-xs text-luxury-neutral/50">After 8% platform fee</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-luxury-dark to-luxury-dark/95 border-luxury-primary/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-luxury-primary/10 rounded-full">
                <Users className="h-6 w-6 text-luxury-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-luxury-neutral/70">Subscribers</h3>
                <p className="text-2xl font-bold text-luxury-primary">{stats.totalSubscribers}</p>
                <span className="text-xs text-luxury-neutral/50">{stats.followers} followers</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-luxury-dark to-luxury-dark/95 border-luxury-primary/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-luxury-primary/10 rounded-full">
                <Eye className="h-6 w-6 text-luxury-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-luxury-neutral/70">Total Views</h3>
                <p className="text-2xl font-bold text-luxury-primary">{stats.totalViews}</p>
                <span className="text-xs text-luxury-neutral/50">Across all content</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-luxury-dark to-luxury-dark/95 border-luxury-primary/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-luxury-primary/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-luxury-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-luxury-neutral/70">Engagement Rate</h3>
                <p className="text-2xl font-bold text-luxury-primary">
                  {stats.engagementRate}%
                </p>
                <span className="text-xs text-luxury-neutral/50">Based on interactions</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Engagement Chart */}
          <Card className="p-6 bg-gradient-to-br from-luxury-dark to-luxury-dark/95 border-luxury-primary/20">
            <h3 className="text-xl font-bold mb-6 text-luxury-primary">Engagement Over Time</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8884d8" 
                    name="Interactions"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Content Distribution */}
          <Card className="p-6 bg-gradient-to-br from-luxury-dark to-luxury-dark/95 border-luxury-primary/20">
            <h3 className="text-xl font-bold mb-6 text-luxury-primary">Content Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card className="p-6 bg-gradient-to-br from-luxury-dark to-luxury-dark/95 border-luxury-primary/20">
          <h3 className="text-xl font-bold mb-6 text-luxury-primary">Revenue Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="amount" fill="#8884d8" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}