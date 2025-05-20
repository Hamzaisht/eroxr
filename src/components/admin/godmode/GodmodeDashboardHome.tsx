
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types/database.types";
import AdminLogsTable from "./AdminLogsTable";
import { isQueryError } from "@/utils/supabase/typeSafeOperations";

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileKey = keyof ProfileRow;

type StoryRow = Database['public']['Tables']['stories']['Row'];
type StoryKey = keyof StoryRow;

// Define ReportRow type with fallback in case it doesn't exist in the schema
type ReportRow = 'reports' extends keyof Database['public']['Tables'] 
  ? Database['public']['Tables']['reports']['Row']
  : { id: string; status: string; }; 
type ReportKey = keyof ReportRow;

export const GodmodeDashboardHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalContent: 0,
    pendingReports: 0,
    recentSignups: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        // Count total users
        const { count: totalUsers, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Count active users (those who were online in the last 24 hours)
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        
        const { count: activeUsers, error: activeError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_suspended', false)
          .gt('last_active_at', oneDayAgo.toISOString());

        // Count total content (posts and stories)
        const { count: postCount, error: postError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true });

        const { count: storyCount, error: storyError } = await supabase
          .from('stories')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        // Count pending reports
        let pendingReports = 0;
        try {
          // Try to query reports table, but handle the case when it doesn't exist
          const { count, error: reportsError } = await supabase
            .from('reports')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');
            
          if (!reportsError) {
            pendingReports = count || 0;
          }
        } catch (e) {
          console.warn("Reports table may not exist:", e);
        }

        // Count recent signups (last 24 hours)
        const { count: recentSignups, error: signupsError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gt('created_at', oneDayAgo.toISOString());

        // Update state with fetched data
        setStats({
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers || 0,
          totalContent: (postCount || 0) + (storyCount || 0),
          pendingReports: pendingReports || 0,
          recentSignups: recentSignups || 0
        });

        // Handle any errors
        if (usersError || activeError || postError || storyError || signupsError) {
          throw new Error("Error fetching statistics");
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [toast]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers} isLoading={isLoading} />
        <StatCard title="Active Users" value={stats.activeUsers} isLoading={isLoading} />
        <StatCard title="Total Content" value={stats.totalContent} isLoading={isLoading} />
        <StatCard title="Pending Reports" value={stats.pendingReports} isLoading={isLoading} />
        <StatCard title="Recent Signups" value={stats.recentSignups} isLoading={isLoading} />
      </div>
      
      <AdminLogsTable />
    </div>
  );
};

const StatCard = ({ 
  title, 
  value, 
  isLoading 
}: { 
  title: string; 
  value: number;
  isLoading: boolean;
}) => {
  return (
    <div className="bg-slate-800/50 border rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      {isLoading ? (
        <div className="h-8 w-16 bg-gray-700/50 animate-pulse rounded mt-1"></div>
      ) : (
        <p className="text-2xl font-semibold mt-1">{value.toLocaleString()}</p>
      )}
    </div>
  );
};

export default GodmodeDashboardHome;
