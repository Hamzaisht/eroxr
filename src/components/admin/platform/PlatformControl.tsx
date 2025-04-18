
import { useState, useEffect } from "react";
import { useGhostMode } from "@/hooks/useGhostMode";
import { GhostModeToggle } from "./GhostModeToggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client"; 
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  UserCheck, 
  AlertTriangle, 
  Trash2, 
  BarChart, 
  CreditCard,
  Loader2,
  Shield
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export const PlatformControl = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSession();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  // Check user admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .in('role', ['admin', 'super_admin'])
          .single();
          
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (err) {
        console.error('Exception checking admin status:', err);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [session]);
  
  // Fetch platform stats for admin dashboard
  const { data: platformStats, isLoading: statsLoading } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      if (!isAdmin) return null;
      
      try {
        // Fetch user counts
        const { data: userCount, error: userError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });
          
        // Fetch report counts  
        const { data: reportCount, error: reportError } = await supabase
          .from('reports')
          .select('id, status', { count: 'exact' });
          
        // Fetch verification requests
        const { data: verificationCount, error: verificationError } = await supabase
          .from('id_verifications')
          .select('id, status', { count: 'exact' });
          
        // Fetch content stats
        const { data: contentStats, error: contentError } = await supabase
          .from('posts')
          .select('id', { count: 'exact', head: true });
          
        if (userError || reportError || verificationError || contentError) {
          throw new Error('Error fetching platform stats');
        }
        
        // Calculate pending reports
        const pendingReports = reportCount?.filter(r => r.status === 'pending').length || 0;
        
        // Calculate pending verifications
        const pendingVerifications = verificationCount?.filter(v => v.status === 'pending').length || 0;
        
        return {
          users: userCount?.count || 0,
          reports: reportCount?.length || 0,
          pendingReports,
          verifications: verificationCount?.length || 0,
          pendingVerifications,
          content: contentStats?.count || 0
        };
      } catch (err) {
        console.error('Error fetching platform stats:', err);
        throw err;
      }
    },
    enabled: isAdmin === true
  });
  
  // Get the current active tab based on URL
  const getActiveTab = () => {
    if (location.pathname.includes('/users')) return 'users';
    if (location.pathname.includes('/verifications')) return 'verifications';
    if (location.pathname.includes('/flagged')) return 'flagged';
    if (location.pathname.includes('/deleted')) return 'deleted';
    if (location.pathname.includes('/analytics')) return 'analytics';
    if (location.pathname.includes('/payouts')) return 'payouts';
    return 'users'; // Default
  };

  const handleTabChange = (value: string) => {
    navigate(`/admin/platform/${value}`);
  };
  
  // Show loading state while checking admin status
  if (isAdmin === null) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
      </div>
    );
  }
  
  // Show access denied if not admin
  if (isAdmin === false) {
    return (
      <div className="p-6 space-y-6">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access the Platform Control panel.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Platform Control</h1>
        <GhostModeToggle />
      </div>
      
      {/* Platform Overview Stats */}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-[#161B22]/50 backdrop-blur-xl border border-white/10 rounded-lg p-4 h-24 animate-pulse">
              <div className="h-4 w-1/2 bg-white/10 rounded mb-2"></div>
              <div className="h-8 w-16 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-[#161B22]/50 backdrop-blur-xl border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-white/60 mb-1">
              <Users className="h-4 w-4" />
              <span>Total Users</span>
            </div>
            <p className="text-2xl font-bold">{platformStats?.users || 0}</p>
          </div>
          <div className="bg-[#161B22]/50 backdrop-blur-xl border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-white/60 mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span>Pending Reports</span>
            </div>
            <p className="text-2xl font-bold">{platformStats?.pendingReports || 0}</p>
          </div>
          <div className="bg-[#161B22]/50 backdrop-blur-xl border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-white/60 mb-1">
              <UserCheck className="h-4 w-4" />
              <span>Pending Verifications</span>
            </div>
            <p className="text-2xl font-bold">{platformStats?.pendingVerifications || 0}</p>
          </div>
          <div className="bg-[#161B22]/50 backdrop-blur-xl border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-white/60 mb-1">
              <BarChart className="h-4 w-4" />
              <span>Content Items</span>
            </div>
            <p className="text-2xl font-bold">{platformStats?.content || 0}</p>
          </div>
          <div className="bg-[#161B22]/50 backdrop-blur-xl border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-white/60 mb-1">
              <Trash2 className="h-4 w-4" />
              <span>Removed Items</span>
            </div>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-[#161B22]/50 backdrop-blur-xl border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-white/60 mb-1">
              <CreditCard className="h-4 w-4" />
              <span>Payment Requests</span>
            </div>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      )}
      
      {/* Navigation tabs */}
      <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full bg-[#161B22] p-1 rounded-lg grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden md:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="verifications" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            <span className="hidden md:inline">Verifications</span>
          </TabsTrigger>
          <TabsTrigger value="flagged" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden md:inline">Flagged</span>
          </TabsTrigger>
          <TabsTrigger value="deleted" className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            <span className="hidden md:inline">Deleted</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            <span className="hidden md:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="payouts" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden md:inline">Payouts</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Content area - this will render the route's component via Outlet */}
      <div className="bg-[#161B22]/50 backdrop-blur-xl border border-white/10 rounded-lg p-4 md:p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default PlatformControl;
