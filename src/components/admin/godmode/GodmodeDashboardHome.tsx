
import { useState, useEffect } from "react";
import { AdminLogsTable } from "./AdminLogsTable";
import { supabase } from "@/integrations/supabase/client";
import { toDbValue } from "@/utils/supabase/type-guards";

export const GodmodeDashboardHome = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalCreators, setTotalCreators] = useState<number>(0);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [totalReports, setTotalReports] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Fetch total users
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        setTotalUsers(toDbValue(usersCount || 0));
        
        // Fetch total creators (users with is_paying_customer=true)
        const { count: creatorsCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_paying_customer', true);
        
        setTotalCreators(toDbValue(creatorsCount || 0));
        
        // Fetch total posts
        const { count: postsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true });
        
        setTotalPosts(toDbValue(postsCount || 0));
        
        // Fetch total reports
        const { count: reportsCount } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true });
        
        setTotalReports(toDbValue(reportsCount || 0));
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={totalUsers} isLoading={isLoading} />
        <StatCard title="Total Creators" value={totalCreators} isLoading={isLoading} />
        <StatCard title="Total Posts" value={totalPosts} isLoading={isLoading} />
        <StatCard title="Total Reports" value={totalReports} isLoading={isLoading} />
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
