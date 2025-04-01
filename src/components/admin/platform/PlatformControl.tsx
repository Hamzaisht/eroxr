
import { useGhostMode } from "@/hooks/useGhostMode";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  Users, 
  UserCheck, 
  AlertTriangle, 
  Trash2, 
  BarChart, 
  CreditCard,
  Ghost
} from "lucide-react";
import { GhostModeToggle } from "./GhostModeToggle";

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
    if (location.pathname.includes('/payouts')) return 'payouts';
    if (location.pathname.includes('/surveillance')) return 'surveillance';
    return 'users'; // Default
  };

  const handleTabChange = (value: string) => {
    navigate(`/admin/platform/${value}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-luxury-neutral">Platform Control</h1>
        <GhostModeToggle />
      </div>
      
      {/* Navigation tabs */}
      <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full bg-[#161B22] p-1 rounded-lg grid grid-cols-1 sm:grid-cols-3 md:grid-cols-7">
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
          {isGhostMode && (
            <TabsTrigger value="surveillance" className="flex items-center gap-2 bg-purple-900/30 text-purple-300 border-purple-700/50">
              <Ghost className="w-4 h-4" />
              <span className="hidden md:inline">Surveillance</span>
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>
      
      {/* Content area */}
      <div className="bg-[#161B22]/50 backdrop-blur-xl border border-white/10 rounded-lg p-4 md:p-6">
        <Outlet />
      </div>
    </div>
  );
};
