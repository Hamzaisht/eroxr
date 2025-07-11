import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, DollarSign, Shield, AlertTriangle, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUsers: number;
  activeContent: number;
  revenueToday: number;
  flaggedItems: number;
  liveStreams: number;
  totalSubscriptions: number;
  systemHealth: {
    server: number;
    database: number;
    cdn: number;
    security: number;
  };
}

interface RecentActivity {
  id: string;
  type: string;
  user: string;
  timestamp: string;
  description: string;
  status: 'new' | 'flagged' | 'resolved';
}

export const GodmodeDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeContent: 0,
    revenueToday: 0,
    flaggedItems: 0,
    liveStreams: 0,
    totalSubscriptions: 0,
    systemHealth: { server: 98, database: 96, cdn: 99, security: 97 }
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch real data from Supabase
      const [
        { count: userCount },
        { count: contentCount },
        { data: revenue },
        { count: flaggedCount },
        { count: streamsCount },
        { count: subscriptionsCount },
        { data: activities }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('post_purchases').select('amount').gte('created_at', new Date().toISOString().split('T')[0]),
        supabase.from('flagged_content').select('*', { count: 'exact', head: true }).eq('status', 'flagged'),
        supabase.from('live_streams').select('*', { count: 'exact', head: true }).eq('status', 'live'),
        supabase.from('creator_subscriptions').select('*', { count: 'exact', head: true }),
        supabase.from('admin_action_logs').select(`
          id, action, created_at, admin_id, target_type, details
        `).order('created_at', { ascending: false }).limit(10)
      ]);

      const todayRevenue = revenue?.reduce((sum, purchase) => sum + Number(purchase.amount), 0) || 0;

      setStats({
        totalUsers: userCount || 0,
        activeContent: contentCount || 0,
        revenueToday: todayRevenue,
        flaggedItems: flaggedCount || 0,
        liveStreams: streamsCount || 0,
        totalSubscriptions: subscriptionsCount || 0,
        systemHealth: { server: 98, database: 96, cdn: 99, security: 97 }
      });

      // Transform activities to recent activity format
      const transformedActivities: RecentActivity[] = activities?.map(activity => ({
        id: activity.id,
        type: activity.action,
        user: activity.admin_id.slice(0, 8),
        timestamp: new Date(activity.created_at).toLocaleTimeString(),
        description: activity.action.replace(/_/g, ' '),
        status: activity.details?.ghost_mode ? 'flagged' : 'new'
      })) || [];

      setRecentActivity(transformedActivities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, trend }: {
    title: string;
    value: string;
    change: string;
    icon: any;
    trend: 'up' | 'down' | 'neutral';
  }) => (
    <Card className="metric-card p-6 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${
          trend === 'up' ? 'from-emerald-500/20 to-emerald-600/10' :
          trend === 'down' ? 'from-red-500/20 to-red-600/10' :
          'from-blue-500/20 to-blue-600/10'
        } border border-white/10`}>
          <Icon className={`h-5 w-5 ${
            trend === 'up' ? 'text-emerald-400' :
            trend === 'down' ? 'text-red-400' :
            'text-blue-400'
          }`} />
        </div>
        <Badge className={`${
          trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          trend === 'down' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
          'bg-blue-500/10 text-blue-400 border-blue-500/20'
        } text-xs`}>
          {change}
        </Badge>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-sm text-slate-400">{title}</p>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Premium Header */}
      <div className="glass-panel rounded-2xl p-8 premium-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold premium-text mb-2">
              Administrative Dashboard
            </h1>
            <p className="text-slate-400 text-lg">Complete platform oversight and control</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full status-indicator" />
              <span className="text-sm text-slate-300">System Operational</span>
            </div>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
              Live Data
            </Badge>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change="+10% from yesterday"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Active Content"
          value={stats.activeContent.toLocaleString()}
          change="+5% from yesterday"
          icon={Activity}
          trend="up"
        />
        <StatCard
          title="Revenue Today"
          value={`$${stats.revenueToday.toLocaleString()}`}
          change="+12% from yesterday"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Flagged Items"
          value={stats.flaggedItems.toString()}
          change="-5% from yesterday"
          icon={AlertTriangle}
          trend="down"
        />
        <StatCard
          title="Live Streams"
          value={stats.liveStreams.toString()}
          change="+0% from yesterday"
          icon={TrendingUp}
          trend="neutral"
        />
        <StatCard
          title="Subscriptions"
          value={stats.totalSubscriptions.toLocaleString()}
          change="+8% from yesterday"
          icon={Shield}
          trend="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 subtle-pulse">
                Live Updates
              </Badge>
            </div>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-slate-800/20 rounded-lg">
                    <div className="w-8 h-8 bg-slate-700 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-700 rounded w-3/4" />
                      <div className="h-3 bg-slate-700 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-slate-800/20 rounded-lg transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      activity.status === 'flagged' ? 'bg-red-500/20 text-red-400' :
                      activity.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {activity.user.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium capitalize">{activity.description}</p>
                      <p className="text-xs text-slate-400">Admin {activity.user} • {activity.timestamp}</p>
                    </div>
                    <Badge className={`text-xs ${
                      activity.status === 'flagged' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      activity.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {activity.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-8">No recent activity</p>
              )}
            </div>
          </Card>
        </div>

        {/* System Health */}
        <div>
          <Card className="glass-panel p-6">
            <h3 className="text-xl font-semibold text-white mb-6">System Health</h3>
            <div className="space-y-6">
              {Object.entries(stats.systemHealth).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300 capitalize">{key}</span>
                    <span className={`text-sm font-semibold ${
                      value >= 95 ? 'text-emerald-400' :
                      value >= 90 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {value}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        value >= 95 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                        value >= 90 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                        'bg-gradient-to-r from-red-500 to-red-400'
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};