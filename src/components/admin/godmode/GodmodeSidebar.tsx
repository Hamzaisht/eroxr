
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Eye, 
  Layers, 
  Shield, 
  BadgeCheck, 
  CreditCard, 
  Database, 
  ClipboardList,
  Ghost,
  LayoutDashboard,
  AlertTriangle
} from "lucide-react";
import { useGhostMode } from "@/hooks/useGhostMode";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

const godmodeTabs = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/godmode",
  },
  {
    label: "Surveillance",
    icon: Eye,
    href: "/admin/godmode/surveillance",
  },
  {
    label: "Content Feed",
    icon: Layers,
    href: "/admin/godmode/content",
  },
  {
    label: "Moderation",
    icon: Shield,
    href: "/admin/godmode/moderation",
  },
  {
    label: "Verification",
    icon: BadgeCheck,
    href: "/admin/godmode/verification",
  },
  {
    label: "Payouts",
    icon: CreditCard,
    href: "/admin/godmode/payouts",
  },
  {
    label: "Platform Control",
    icon: Database,
    href: "/admin/godmode/platform",
  },
  {
    label: "Admin Logs",
    icon: ClipboardList,
    href: "/admin/godmode/logs",
  },
];

export function GodmodeSidebar() {
  const location = useLocation();
  const { isGhostMode, toggleGhostMode, isLoading: isGhostLoading } = useGhostMode();

  return (
    <div className="w-64 border-r border-luxury-primary/10 bg-gradient-to-b from-[#0D1117] to-[#161B22] h-screen overflow-y-auto">
      <div className="p-6">
        <Link to="/admin/godmode" className="flex items-center mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent">
            God Mode
          </h2>
        </Link>

        {/* Ghost Mode Toggle */}
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
                  <Switch 
                    checked={isGhostMode} 
                    onCheckedChange={toggleGhostMode}
                    disabled={isGhostLoading}
                    className={isGhostMode ? "bg-purple-600" : ""}
                  />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{isGhostMode ? "Invisible browsing active" : "Browse invisibly"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-1">
          <p className="text-xs uppercase text-muted-foreground mb-2">Navigation</p>
          {godmodeTabs.map((tab) => (
            <Link
              key={tab.href}
              to={tab.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                location.pathname === tab.href || location.pathname.startsWith(`${tab.href}/`)
                  ? "bg-luxury-primary/10 text-luxury-primary"
                  : "text-muted-foreground hover:bg-luxury-primary/5 hover:text-luxury-primary"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Link>
          ))}
        </div>

        <Separator className="my-4 bg-white/5" />

        {/* Super Admin Info */}
        <div className="bg-black/70 backdrop-blur-sm px-3 py-2 rounded-md mt-auto">
          <div className="flex items-center gap-2 text-xs text-red-300">
            <AlertTriangle className="h-4 w-4" />
            <div>
              <p className="font-medium">God Mode Active</p>
              <p className="text-gray-400 text-xs">Full system access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
