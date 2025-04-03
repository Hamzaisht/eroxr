
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
  LayoutDashboard
} from "lucide-react";

const godmodeTabs = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/godmode",
  },
  {
    label: "Surveillance",
    icon: Eye,
    href: "/admin/platform/surveillance",
  },
  {
    label: "Content Feed",
    icon: Layers,
    href: "/admin/platform/content-feed",
  },
  {
    label: "Moderation",
    icon: Shield,
    href: "/admin/platform/moderation",
  },
  {
    label: "Verification",
    icon: BadgeCheck,
    href: "/admin/platform/verification",
  },
  {
    label: "Payouts",
    icon: CreditCard,
    href: "/admin/platform/payouts",
  },
  {
    label: "Platform Control",
    icon: Database,
    href: "/admin/platform/control",
  },
  {
    label: "Admin Logs",
    icon: ClipboardList,
    href: "/admin/platform/logs",
  },
];

export const GodModeNavigation = () => {
  const location = useLocation();
  
  return (
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
  );
};
