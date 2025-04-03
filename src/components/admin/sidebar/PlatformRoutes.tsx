
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, 
  UserCheck, 
  AlertTriangle, 
  Trash2, 
  BarChart, 
  CreditCard,
} from "lucide-react";

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

export const PlatformRoutes = () => {
  const location = useLocation();
  
  return (
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
  );
};
