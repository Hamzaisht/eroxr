
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Users, MessageSquare, Image, Video, Flag, ShieldAlert } from "lucide-react";

export const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: usersCount },
        { count: messagesCount },
        { count: photosCount },
        { count: videosCount },
        { count: reportsCount },
        { count: violationsCount },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('direct_messages').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }).not('media_url', 'eq', '{}'),
        supabase.from('posts').select('*', { count: 'exact', head: true }).not('video_urls', 'eq', '{}'),
        supabase.from('reports').select('*', { count: 'exact', head: true }),
        supabase.from('security_violations').select('*', { count: 'exact', head: true }),
      ]);

      return {
        users: usersCount || 0,
        messages: messagesCount || 0,
        photos: photosCount || 0,
        videos: videosCount || 0,
        reports: reportsCount || 0,
        violations: violationsCount || 0,
      };
    }
  });

  const statCards = [
    { label: 'Total Users', value: stats?.users || 0, icon: Users },
    { label: 'Messages', value: stats?.messages || 0, icon: MessageSquare },
    { label: 'Photos', value: stats?.photos || 0, icon: Image },
    { label: 'Videos', value: stats?.videos || 0, icon: Video },
    { label: 'Reports', value: stats?.reports || 0, icon: Flag },
    { label: 'Violations', value: stats?.violations || 0, icon: ShieldAlert },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-luxury-neutral">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-6 bg-[#161B22]/80 backdrop-blur-xl border-white/10">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-luxury-primary/10">
                <stat.icon className="w-6 h-6 text-luxury-primary" />
              </div>
              <div>
                <p className="text-sm text-luxury-neutral/60">{stat.label}</p>
                <p className="text-2xl font-bold text-luxury-neutral">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
