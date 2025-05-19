import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  asColumnName,
  asIdVerificationStatus, 
  asLiveStreamStatus, 
  asProfileIsSuspended, 
  asProfileStatus, 
  asReportStatus,
  asColumnValue 
} from "@/utils/supabase/helpers";
import { 
  safeProfileFilter, 
  safeReportFilter, 
  safeLiveStreamFilter, 
  safeIdVerificationFilter 
} from "@/utils/supabase/type-guards";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  MessageSquare, 
  Image, 
  Video, 
  Flag, 
  ShieldAlert, 
  DollarSign,
  Server,
  AlertTriangle,
  UserX,
  Clock,
  BadgeAlert,
  LogOut
} from "lucide-react";
import { Database } from "@/integrations/supabase/types/database.types";

interface PlatformStats {
  activeUsers: number;
  bannedUsers: number;
  totalPosts: number;
  totalMessages: number;
  pendingReports: number;
  totalViolations: number;
  onlineUsers: number;
  totalPhotos: number;
  totalVideos: number;
  pendingVerifications: number;
  activeStreams: number;
  systemHealth: 'good' | 'warning' | 'critical';
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Enable real-time updates for relevant tables
  useRealtimeUpdates('profiles');
  useRealtimeUpdates('posts');
  useRealtimeUpdates('reports');
  useRealtimeUpdates('security_violations');
  useRealtimeUpdates('live_streams');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-platform-stats'],
    queryFn: async () => {
      const [suspendedCol, suspendedVal] = safeProfileFilter('is_suspended', false);
      const [suspendedCol2, suspendedVal2] = safeProfileFilter('is_suspended', true);
      const [reportStatusCol, reportStatusVal] = safeReportFilter('status', 'pending');
      const [verificationStatusCol, verificationStatusVal] = safeIdVerificationFilter('status', 'pending');
      const [streamStatusCol, streamStatusVal] = safeLiveStreamFilter('status', 'live');
      const [onlineStatusCol, onlineStatusVal] = safeProfileFilter('status', 'online');

      const [
        { count: activeUsers },
        { count: bannedUsers },
        { count: totalPosts },
        { count: totalMessages },
        { count: pendingReports },
        { count: totalViolations },
        { count: totalPhotos },
        { count: totalVideos },
        { count: pendingVerifications },
        { count: activeStreams },
        { data: onlineUsers },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq(suspendedCol, suspendedVal),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq(suspendedCol2, suspendedVal2),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('direct_messages').select('*', { count: 'exact', head: true }),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq(reportStatusCol, reportStatusVal),
        supabase.from('security_violations').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }).not('media_url', 'eq', '{}'),
        supabase.from('posts').select('*', { count: 'exact', head: true }).not('video_urls', 'eq', '{}'),
        supabase.from('id_verifications').select('*', { count: 'exact', head: true }).eq(verificationStatusCol, verificationStatusVal),
        supabase.from('live_streams').select('*', { count: 'exact', head: true }).eq(streamStatusCol, streamStatusVal),
        supabase.from('profiles').select('id').eq(onlineStatusCol, onlineStatusVal),
      ]);

      return {
        activeUsers: activeUsers || 0,
        bannedUsers: bannedUsers || 0,
        totalPosts: totalPosts || 0,
        totalMessages: totalMessages || 0,
        pendingReports: pendingReports || 0,
        totalViolations: totalViolations || 0,
        onlineUsers: onlineUsers?.length || 0,
        totalPhotos: totalPhotos || 0,
        totalVideos: totalVideos || 0,
        pendingVerifications: pendingVerifications || 0,
        activeStreams: activeStreams || 0,
        systemHealth: 'good' as const,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleExitGodMode = () => {
    toast({
      title: "Exiting God Mode",
      description: "Redirecting to user interface...",
    });
    navigate('/home');
  };

  const statCards = [
    { 
      label: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: Users,
      color: 'text-green-500',
      description: 'Currently active accounts'
    },
    { 
      label: 'Banned Users',
      value: stats?.bannedUsers || 0,
      icon: UserX,
      color: 'text-red-500',
      description: 'Suspended accounts'
    },
    { 
      label: 'Online Now',
      value: stats?.onlineUsers || 0,
      icon: Clock,
      color: 'text-blue-500',
      description: 'Users currently online'
    },
    { 
      label: 'Pending Reports',
      value: stats?.pendingReports || 0,
      icon: Flag,
      color: 'text-yellow-500',
      description: 'Awaiting moderation'
    },
    { 
      label: 'Security Violations',
      value: stats?.totalViolations || 0,
      icon: ShieldAlert,
      color: 'text-red-500',
      description: 'Total security incidents'
    },
    { 
      label: 'System Health',
      value: stats?.systemHealth || 'good',
      icon: Server,
      color: 'text-green-500',
      description: 'Overall platform status'
    },
    { 
      label: 'Active Streams',
      value: stats?.activeStreams || 0,
      icon: Video,
      color: 'text-purple-500',
      description: 'Live broadcasts'
    },
    { 
      label: 'Pending Verifications',
      value: stats?.pendingVerifications || 0,
      icon: BadgeAlert,
      color: 'text-blue-500',
      description: 'Awaiting verification'
    },
    { 
      label: 'Total Content',
      value: (stats?.totalPhotos || 0) + (stats?.totalVideos || 0),
      icon: Image,
      color: 'text-pink-500',
      description: 'Photos and videos'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-luxury-neutral">Admin Control Panel</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex h-3 w-3 rounded-full ${
              stats?.systemHealth === 'good' ? 'bg-green-500' :
              stats?.systemHealth === 'warning' ? 'bg-yellow-500' :
              'bg-red-500'
            } animate-pulse`}/>
            <span className="text-sm text-luxury-neutral/60">
              System Status: {stats?.systemHealth || 'Loading...'}
            </span>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleExitGodMode}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Exit God Mode
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card 
            key={stat.label} 
            className="p-6 bg-[#161B22]/80 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full bg-opacity-10 ${stat.color} bg-current`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-luxury-neutral/60">{stat.label}</p>
                <p className="text-2xl font-bold text-luxury-neutral">{stat.value}</p>
                <p className="text-xs text-luxury-neutral/40">{stat.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
    </div>
  );
};
