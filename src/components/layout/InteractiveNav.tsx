import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  Video, 
  Plus, 
  Users, 
  Heart,
  ChartBar,
  Crown,
  Star,
  LogOut
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvailabilityIndicator } from "@/components/ui/availability-indicator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { LucideIcon } from "lucide-react";

type UserRole = 'admin' | 'moderator' | 'user' | 'creator';

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
    requiresAdmin: true 
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
    icon: Heart,
    label: "Dating Ads", 
    path: "/dating",
    requiresAuth: true 
  }
];

export const InteractiveNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSession();
  const { toast } = useToast();

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

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        throw roleError;
      }

      return {
        ...profileData,
        role: (roleData?.role || 'user') as UserRole
      };
    },
    enabled: !!session?.user?.id,
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/login");
      toast({
        title: "Logged out successfully",
        description: "See you soon!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again",
      });
    }
  };

  return (
    <motion.nav
      initial={false}
      animate={{ width: isExpanded ? 240 : 80 }}
      className="fixed left-0 top-0 h-screen bg-[#0D1117]/95 backdrop-blur-xl border-r border-luxury-primary/10 z-50"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col h-full py-8">
        {session && (
          <motion.div 
            className="px-4 mb-8 cursor-pointer"
            animate={{ opacity: isExpanded ? 1 : 0.5 }}
            onClick={() => navigate(`/profile/${session.user.id}`)}
          >
            <div className="relative group">
              <Avatar className="w-12 h-12 ring-2 ring-luxury-primary/20 transition-all duration-200 group-hover:ring-luxury-primary/40">
                <AvatarImage 
                  src={profile?.avatar_url} 
                  alt={profile?.username || "User"} 
                />
                <AvatarFallback className="bg-luxury-darker text-luxury-primary">
                  {profile?.username?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                <AvailabilityIndicator 
                  status={profile?.status || "offline"} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(profile?.status === 'online' ? 'offline' : 'online');
                  }}
                />
              </div>
            </div>
            
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3"
              >
                <p className="text-sm font-medium text-luxury-neutral">
                  {profile?.username || "Guest"}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.requiresAdmin && profile?.role !== "admin") {
            return null;
          }

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

        {session && (
          <motion.div 
            className="px-4 mt-auto"
            animate={{ opacity: isExpanded ? 1 : 0.5 }}
          >
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5" />
              {isExpanded && "Log out"}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
