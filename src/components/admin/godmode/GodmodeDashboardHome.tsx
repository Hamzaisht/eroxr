import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toDbValue } from "@/utils/supabase/type-guards"; 
import { 
  Users, 
  MessageSquare, 
  Image, 
  Video, 
  AlertTriangle, 
  Ban,
  DollarSign,
  Eye,
  Clock,
  Server,
  BadgeCheck,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

export function GodmodeDashboardHome() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['godmode-platform-stats'],
    queryFn: async () => {
      const [
        { count: activeUsers },
        { count: bannedUsers },
        { count: pendingReports },
        { count: pendingVerifications },
        { count: activeStreams },
        { data: alerts },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_suspended', toDbValue(false)),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_suspended', toDbValue(true)),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', toDbValue('pending')),
        supabase.from('id_verifications').select('*', { count: 'exact', head: true }).eq('status', toDbValue('pending')),
        supabase.from('live_streams').select('*', { count: 'exact', head: true }).eq('status', toDbValue('live')),
        supabase.from('admin_audit_logs').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      return {
        activeUsers: activeUsers || 0,
        bannedUsers: bannedUsers || 0,
        pendingReports: pendingReports || 0,
        pendingVerifications: pendingVerifications || 0,
        activeStreams: activeStreams || 0,
        recentActions: alerts || [],
        systemHealth: 'good' as const,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const statCards = [
    { 
      label: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: Users,
      color: 'text-green-500',
      href: '/admin/godmode/moderation'
    },
    { 
      label: 'Banned Users',
      value: stats?.bannedUsers || 0,
      icon: Ban,
      color: 'text-red-500',
      href: '/admin/godmode/moderation'
    },
    { 
      label: 'Active Streams',
      value: stats?.activeStreams || 0,
      icon: Video,
      color: 'text-purple-500',
      href: '/admin/godmode/surveillance'
    },
    { 
      label: 'Pending Reports',
      value: stats?.pendingReports || 0,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      href: '/admin/godmode/moderation'
    },
    { 
      label: 'Pending Verifications',
      value: stats?.pendingVerifications || 0,
      icon: BadgeCheck,
      color: 'text-blue-500',
      href: '/admin/godmode/verification'
    },
    { 
      label: 'System Health',
      value: stats?.systemHealth || 'good',
      icon: Server,
      color: 'text-green-500',
      href: '/admin/godmode/platform'
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/godmode">Admin</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/godmode">Godmode</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <h1 className="text-2xl font-bold text-luxury-neutral">Godmode Control Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card 
            key={stat.label} 
            className="p-6 bg-[#161B22]/80 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            onClick={() => navigate(stat.href)}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full bg-opacity-10 ${stat.color} bg-current`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-luxury-neutral/60">{stat.label}</p>
                <p className="text-2xl font-bold text-luxury-neutral">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Admin Activity</h2>
        <Card className="bg-[#161B22]/80 backdrop-blur-xl border-white/10">
          <div className="p-4">
            {stats?.recentActions?.length ? (
              <div className="space-y-4">
                {stats.recentActions.map((action: any) => (
                  <div key={action.id} className="flex items-start gap-3 border-b border-white/5 pb-3">
                    <div className="bg-luxury-primary/10 p-2 rounded-full mt-1">
                      <Bell className="h-4 w-4 text-luxury-primary" />
                    </div>
                    <div>
                      <div className="flex gap-2 items-center">
                        <span className="font-medium">{action.action.replace(/_/g, ' ')}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(action.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {action.details && typeof action.details === 'object' 
                          ? `${action.details.timestamp ? new Date(action.details.timestamp).toLocaleString() : ''} 
                             ${action.details.target_username ? `- User: ${action.details.target_username}` : ''}`
                          : 'Action details not available'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                No recent admin activity
              </div>
            )}
          </div>
        </Card>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
    </div>
  );
}
