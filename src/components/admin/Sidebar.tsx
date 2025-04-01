
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, 
  MessageSquare, 
  Image, 
  Video, 
  ShieldAlert, 
  Settings, 
  LayoutDashboard,
  Heart,
  Flag,
  BookMarked,
  BadgeAlert,
  Ghost
} from "lucide-react";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { useGhostMode } from "@/hooks/useGhostMode";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const adminRoutes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    href: "/admin/messages",
  },
  {
    label: "Photos",
    icon: Image,
    href: "/admin/photos",
  },
  {
    label: "Videos",
    icon: Video,
    href: "/admin/videos",
  },
  {
    label: "Saved Content",
    icon: BookMarked,
    href: "/admin/saved",
  },
  {
    label: "Dating Ads",
    icon: Heart,
    href: "/admin/dating",
  },
  {
    label: "Reports",
    icon: Flag,
    href: "/admin/reports",
  },
  {
    label: "Violations",
    icon: ShieldAlert,
    href: "/admin/violations",
  },
  {
    label: "Eros Mode",
    icon: Settings,
    href: "/admin/features",
  },
  {
    label: "Verifications",
    icon: BadgeAlert,
    href: "/admin/verifications",
  }
];

export const Sidebar = () => {
  const location = useLocation();
  const { isSuperAdmin } = useSuperAdminCheck();
  const { isGhostMode, toggleGhostMode, isLoading } = useGhostMode();

  // If not a super admin, don't render the sidebar
  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="w-64 border-r border-white/10 bg-[#0D1117]/50 p-4">
      <div className="flex flex-col space-y-2">
        {adminRoutes.map((route) => (
          <Link
            key={route.href}
            to={route.href}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
              location.pathname === route.href
                ? "bg-luxury-primary text-white"
                : "text-luxury-neutral/60 hover:text-luxury-neutral hover:bg-white/5"
            )}
          >
            <route.icon className="w-5 h-5" />
            <span>{route.label}</span>
          </Link>
        ))}

        <div className="h-px bg-white/5 my-2" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-between px-3 py-2 rounded-lg text-luxury-neutral/80 hover:text-luxury-neutral">
                <div className="flex items-center space-x-2">
                  <Ghost className="w-5 h-5" />
                  <span>Ghost Mode</span>
                </div>
                <Switch 
                  checked={isGhostMode} 
                  onCheckedChange={toggleGhostMode}
                  disabled={isLoading}
                  className={isGhostMode ? "bg-purple-600" : ""}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Browse invisibly - no typing indicators, read receipts, or presence</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
