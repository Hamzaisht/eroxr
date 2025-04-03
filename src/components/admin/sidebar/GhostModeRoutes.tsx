
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Eye,
  Webcam,
  Video,
  MessageSquare,
  Heart,
} from "lucide-react";

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

interface GhostModeRoutesProps {
  isGhostMode: boolean;
}

export const GhostModeRoutes = ({ isGhostMode }: GhostModeRoutesProps) => {
  const location = useLocation();
  
  if (!isGhostMode) return null;
  
  return (
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
  );
};
