import React, { useEffect, useState } from 'react';
import { Users, FileImage, DollarSign, Flag, TrendingUp, Activity, Zap, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
  trend: 'up' | 'down' | 'neutral';
}

export const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousStats, setPreviousStats] = useState<Record<string, number>>({});

  const calculateChange = (current: number, previous: number): { value: string; trend: 'up' | 'down' | 'neutral' } => {
    if (previous === 0) return { value: '+0%', trend: 'neutral' };
    const change = ((current - previous) / previous) * 100;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    const sign = change > 0 ? '+' : '';
    return { value: `${sign}${change.toFixed(1)}%`, trend };
  };

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      // Parallel fetch all data
      const [
        { count: userCount },
        { count: postCount },
        { count: streamCount },
        { count: flaggedCount },
        { data: revenueData },
        { data: subscriptionData },
        { data: engagementData }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('live_streams').select('*', { count: 'exact', head: true }).eq('status', 'live'),
        supabase.from('flagged_content').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('post_purchases').select('amount').gte('created_at', new Date().toISOString().split('T')[0]),
        supabase.from('creator_subscriptions').select('*', { count: 'exact', head: true }),
        supabase.from('post_likes').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      const todayRevenue = revenueData?.reduce((sum, purchase) => sum + (purchase.amount || 0), 0) || 0;
      const subscriptionCount = subscriptionData?.length || 0;
      const todayEngagement = engagementData?.length || 0;

      const currentStats = {
        users: userCount || 0,
        content: postCount || 0,
        revenue: todayRevenue,
        flagged: flaggedCount || 0,
        streams: streamCount || 0,
        subscriptions: subscriptionCount
      };

      const newStats: StatCard[] = [
        {
          title: 'Total Users',
          value: currentStats.users.toLocaleString(),
          change: calculateChange(currentStats.users, previousStats.users || 0).value,
          trend: calculateChange(currentStats.users, previousStats.users || 0).trend,
          icon: Users,
          color: 'text-blue-400'
        },
        {
          title: 'Active Content',
          value: currentStats.content.toLocaleString(),
          change: calculateChange(currentStats.content, previousStats.content || 0).value,
          trend: calculateChange(currentStats.content, previousStats.content || 0).trend,
          icon: FileImage,
          color: 'text-green-400'
        },
        {
          title: 'Revenue Today',
          value: `$${currentStats.revenue.toLocaleString()}`,
          change: calculateChange(currentStats.revenue, previousStats.revenue || 0).value,
          trend: calculateChange(currentStats.revenue, previousStats.revenue || 0).trend,
          icon: DollarSign,
          color: 'text-yellow-400'
        },
        {
          title: 'Flagged Items',
          value: currentStats.flagged.toString(),
          change: calculateChange(currentStats.flagged, previousStats.flagged || 0).value,
          trend: calculateChange(currentStats.flagged, previousStats.flagged || 0).trend,
          icon: AlertTriangle,
          color: 'text-red-400'
        },
        {
          title: 'Live Streams',
          value: currentStats.streams.toString(),
          change: calculateChange(currentStats.streams, previousStats.streams || 0).value,
          trend: calculateChange(currentStats.streams, previousStats.streams || 0).trend,
          icon: Activity,
          color: 'text-purple-400'
        },
        {
          title: 'Total Subscriptions',
          value: currentStats.subscriptions.toLocaleString(),
          change: calculateChange(currentStats.subscriptions, previousStats.subscriptions || 0).value,
          trend: calculateChange(currentStats.subscriptions, previousStats.subscriptions || 0).trend,
          icon: Zap,
          color: 'text-cyan-400'
        }
      ];

      setStats(newStats);
      setPreviousStats(currentStats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Set up realtime subscriptions for live updates
    const channels = [
      supabase.channel('profiles_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchStats),
      supabase.channel('posts_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchStats),
      supabase.channel('live_streams_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'live_streams' }, fetchStats),
      supabase.channel('flagged_content_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'flagged_content' }, fetchStats),
      supabase.channel('post_purchases_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'post_purchases' }, fetchStats),
      supabase.channel('creator_subscriptions_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'creator_subscriptions' }, fetchStats)
    ];

    channels.forEach(channel => channel.subscribe());

    // Refresh every 30 seconds as backup
    const interval = setInterval(fetchStats, 30000);

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-400' : stat.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'}`}>
                  {stat.change} from yesterday
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};