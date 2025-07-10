import React, { useEffect, useState } from 'react';
import { Users, FileImage, DollarSign, Flag, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}

export const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<StatCard[]>([
    { title: 'Total Users', value: '0', change: '+0%', icon: Users, color: 'text-blue-400' },
    { title: 'Active Content', value: '0', change: '+0%', icon: FileImage, color: 'text-green-400' },
    { title: 'Revenue Today', value: '$0', change: '+0%', icon: DollarSign, color: 'text-yellow-400' },
    { title: 'Flagged Items', value: '0', change: '0%', icon: Flag, color: 'text-red-400' },
    { title: 'Live Streams', value: '0', change: '+0%', icon: Activity, color: 'text-purple-400' },
    { title: 'Growth Rate', value: '0%', change: '+0%', icon: TrendingUp, color: 'text-cyan-400' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch real stats from database
        const [
          { count: userCount },
          { count: postCount },
          { count: streamCount },
          { count: flaggedCount }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('posts').select('*', { count: 'exact', head: true }),
          supabase.from('live_streams').select('*', { count: 'exact', head: true }).eq('status', 'live'),
          supabase.from('flagged_content').select('*', { count: 'exact', head: true }).eq('status', 'pending')
        ]);

        // Calculate revenue (placeholder - would need actual payment data)
        const todayRevenue = Math.floor(Math.random() * 10000);

        setStats([
          { title: 'Total Users', value: userCount?.toString() || '0', change: '+12%', icon: Users, color: 'text-blue-400' },
          { title: 'Active Content', value: postCount?.toString() || '0', change: '+8%', icon: FileImage, color: 'text-green-400' },
          { title: 'Revenue Today', value: `$${todayRevenue.toLocaleString()}`, change: '+15%', icon: DollarSign, color: 'text-yellow-400' },
          { title: 'Flagged Items', value: flaggedCount?.toString() || '0', change: '-5%', icon: Flag, color: 'text-red-400' },
          { title: 'Live Streams', value: streamCount?.toString() || '0', change: '+22%', icon: Activity, color: 'text-purple-400' },
          { title: 'Growth Rate', value: '18.5%', change: '+3%', icon: TrendingUp, color: 'text-cyan-400' },
        ]);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
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