
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, 
  UserCheck, 
  AlertTriangle, 
  Trash2, 
  BarChart, 
  CreditCard,
  Eye,
  Webcam,
  Video,
  MessageSquare,
  Heart,
  Ghost,
  Database
} from "lucide-react";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { useGhostMode } from "@/hooks/useGhostMode";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

const platformRoutes = [
  {
    label: "Users Management",
    icon: Users,
    href: "/admin/platform/users",
  },
  {
    label: "Verification Requests",
    icon: UserCheck,
    href: "/admin/platform/verifications",
  },
  {
    label: "Flagged Content",
    icon: AlertTriangle,
    href: "/admin/platform/flagged",
  },
  {
    label: "Deleted Content",
    icon: Trash2,
    href: "/admin/platform/deleted",
  },
  {
    label: "User Analytics",
    icon: BarChart,
    href: "/admin/platform/analytics",
  },
  {
    label: "Payout Requests",
    icon: CreditCard,
    href: "/admin/platform/payouts",
  }
];

const ghostModeRoutes = [
  {
    label: "Live Surveillance",
    icon: Eye,
    href: "/admin/platform/surveillance",
  },
  {
    label: "Live Streams",
    icon: Webcam,
    href: "/livestreams",
  },
  {
    label: "Active Calls",
    icon: Video,
    href: "/calls",
  },
  {
    label: "Messaging Watch",
    icon: MessageSquare,
    href: "/messages",
  },
  {
    label: "BodyContact Monitor",
    icon: Heart,
    href: "/dating",
  }
];

export const Sidebar = () => {
  const location = useLocation();
  const { isSuperAdmin } = useSuperAdminCheck();
  const { isGhostMode, toggleGhostMode, canUseGhostMode, isLoading: isGhostModeLoading } = useGhostMode();
  const [isToggling, setIsToggling] = useState(false);
  const session = useSession();

  const handleToggle = async () => {
    if (!canUseGhostMode || isToggling || isGhostModeLoading) return;
    
    setIsToggling(true);
    try {
      await toggleGhostMode();
      
      if (session?.user?.id) {
        await supabase
          .from('admin_sessions')
          .upsert({
            admin_id: session.user.id,
            ghost_mode: !isGhostMode,
            activated_at: !isGhostMode ? new Date() : null,
            last_active_at: new Date()
          }, {
            onConflict: 'admin_id'
          });
      }
    } finally {
      setIsToggling(false);
    }
  };

  if (!isSuperAdmin) return null;

  const isLoading = isToggling || isGhostModeLoading;

  return (
    <div className="w-64 border-r border-luxury-primary/10 bg-gradient-to-b from-[#0D1117] to-[#161B22] h-screen overflow-y-auto">
      <div className="p-6">
        <Link to="/admin" className="flex items-center mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent">
            Admin Panel
          </h2>
        </Link>

        {/* Ghost Mode Toggle */}
        {canUseGhostMode && (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-[#161B22] p-3 rounded-md border border-white/5">
              <div className="flex items-center gap-2">
                {isGhostMode ? (
                  <Ghost className="h-5 w-5 text-purple-400" />
                ) : (
                  <Ghost className="h-5 w-5 text-gray-400" />
                )}
                <span>Ghost Mode</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      {isLoading && (
                        <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-dotted border-current" />
                      )}
                      <Switch 
                        checked={isGhostMode} 
                        onCheckedChange={handleToggle}
                        disabled={isLoading}
                        className={isGhostMode ? "bg-purple-600" : ""}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{isLoading ? "Updating ghost mode..." : isGhostMode ? "Invisible browsing active" : "Browse invisibly"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}

        {/* Ghost Mode Surveillance Routes */}
        {isGhostMode && (
          <div className="space-y-1 mb-4">
            <p className="text-xs uppercase text-purple-300 mb-2">Ghost Surveillance</p>
            {ghostModeRoutes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  location.pathname === route.href || location.pathname.startsWith(`${route.href}/`)
                    ? "bg-purple-900/20 text-purple-300"
                    : "text-purple-200/70 hover:bg-purple-900/10 hover:text-purple-300"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs uppercase text-muted-foreground mb-2 mt-4">Platform Control</p>
          {platformRoutes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                location.pathname === route.href || location.pathname.startsWith(`${route.href}/`)
                  ? "bg-luxury-primary/10 text-luxury-primary"
                  : "text-muted-foreground hover:bg-luxury-primary/5 hover:text-luxury-primary"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>

        {/* Ghost Mode Indicator at Bottom */}
        {isGhostMode && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-white border border-purple-500/30 shadow-lg flex items-center gap-2">
              <Ghost className="h-4 w-4 text-purple-400" />
              <span className="text-purple-200">Ghost Mode Active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
