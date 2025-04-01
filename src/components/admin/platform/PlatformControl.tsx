
import { useGhostMode } from "@/hooks/useGhostMode";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  Users, 
  UserCheck, 
  AlertTriangle, 
  Trash2, 
  BarChart, 
  Ghost 
} from "lucide-react";

export const PlatformControl = () => {
  const { isGhostMode } = useGhostMode();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the current active tab based on URL
  const getActiveTab = () => {
    if (location.pathname.includes('/users')) return 'users';
    if (location.pathname.includes('/verifications')) return 'verifications';
    if (location.pathname.includes('/flagged')) return 'flagged';
    if (location.pathname.includes('/deleted')) return 'deleted';
    if (location.pathname.includes('/analytics')) return 'analytics';
    return 'users'; // Default
  };

  const handleTabChange = (value: string) => {
    navigate(`/admin/platform/${value}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-luxury-neutral">Platform Control</h1>
        
        {/* Ghost mode indicator */}
        {isGhostMode && (
          <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-purple-500/30 shadow-lg">
            <Ghost className="h-4 w-4 text-purple-400" />
            <span>Ghost Mode Active</span>
          </div>
        )}
      </div>
      
      {/* Navigation tabs */}
      <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full bg-[#161B22] p-1 rounded-lg grid grid-cols-5">
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
        </TabsList>
      </Tabs>
      
      {/* Content area */}
      <div className="bg-[#161B22]/50 backdrop-blur-xl border border-white/10 rounded-lg p-4 md:p-6">
        <Outlet />
      </div>
    </div>
  );
};
