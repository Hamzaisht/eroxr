import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  Video, 
  Plus, 
  Users, 
  Phone,
  ChartBar,
  Crown,
  Star
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvailabilityIndicator } from "@/components/ui/availability-indicator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

type BadgeInfo = {
  variant: BadgeVariant;
  Icon: LucideIcon | null;
};

const menuItems = [
  { 
    icon: LayoutDashboard, 
    label: "Home", 
    path: "/home",
    requiresAuth: true 
  },
  { 
    icon: ChartBar, 
    label: "Eroboard", 
    path: "/eroboard",
    requiresCreator: true 
  },
  { 
    icon: Video, 
    label: "Eros Shorts", 
    path: "/shorts",
    requiresAuth: true 
  },
  { 
    icon: Users, 
    label: "Categories", 
    path: "/categories",
    requiresAuth: true 
  },
  { 
    icon: Phone, 
    label: "Ero Contact", 
    path: "/dating",
    requiresAuth: true 
  }
];

export const InteractiveNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSession();

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (profileError) throw profileError;

      // Fetch user role in a separate query
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roleError && roleError.code !== 'PGRST116') { // Ignore "no rows returned" error
        throw roleError;
      }

      return {
        ...profileData,
        role: roleData?.role || 'user'
      };
    },
    enabled: !!session?.user?.id,
  });

  const getUserType = () => {
    if (!profile) return "Guest";
    if (profile.id_verification_status === "verified" && profile.is_paying_customer) {
      return "Verified Creator";
    }
    if (profile.is_paying_customer) {
      return "Premium";
    }
    return "Free";
  };

  const getBadgeVariant = (): BadgeInfo => {
    switch (getUserType()) {
      case "Verified Creator":
        return { variant: "default", Icon: Crown };
      case "Premium":
        return { variant: "secondary", Icon: Star };
      default:
        return { variant: "outline", Icon: null };
    }
  };

  const badgeInfo = getBadgeVariant();

  return (
    <motion.nav
      initial={false}
      animate={{ width: isExpanded ? 240 : 80 }}
      className="fixed left-0 top-0 h-screen bg-luxury-dark/50 backdrop-blur-xl border-r border-luxury-primary/10 z-50"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col h-full py-8">
        {session && (
          <motion.div 
            className="px-4 mb-8"
            animate={{ opacity: isExpanded ? 1 : 0.5 }}
          >
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-luxury-primary/20">
                <AvatarImage 
                  src={profile?.avatar_url} 
                  alt={profile?.username || "User"} 
                />
                <AvatarFallback className="bg-luxury-darker text-luxury-primary">
                  {profile?.username?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                <AvailabilityIndicator status="online" size={12} />
              </div>
            </div>
            
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 space-y-1"
              >
                <p className="text-sm font-medium text-luxury-neutral">
                  @{profile?.username || "Guest"}
                </p>
                <Badge 
                  variant={badgeInfo.variant}
                  className="text-xs flex items-center gap-1"
                >
                  {badgeInfo.Icon && <badgeInfo.Icon className="w-3 h-3" />}
                  {getUserType()}
                </Badge>
              </motion.div>
            )}
          </motion.div>
        )}

        <div className="flex-1 px-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            // Skip Eroboard if user is not a verified creator
            if (item.requiresCreator && getUserType() !== "Verified Creator") {
              return null;
            }

            // Skip protected routes if user is not authenticated
            if (item.requiresAuth && !session) {
              return null;
            }

            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors relative group ${
                  isActive 
                    ? "text-luxury-primary bg-luxury-primary/10" 
                    : "text-luxury-neutral/60 hover:text-luxury-primary hover:bg-luxury-primary/5"
                }`}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-5 h-5" />
                <motion.span
                  className="ml-4 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isExpanded ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
                {isActive && (
                  <motion.div
                    className="absolute left-0 w-1 h-full bg-luxury-primary rounded-full"
                    layoutId="activeIndicator"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {session && getUserType() === "Verified Creator" && (
          <motion.div 
            className="px-4 mt-auto"
            animate={{ opacity: isExpanded ? 1 : 0.5 }}
          >
            <Button
              onClick={() => navigate("/shorts/create")}
              className="w-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5 mr-2" />
              {isExpanded && "Add Short"}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};