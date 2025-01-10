import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  Video, 
  Users, 
  Heart,
  ChartBar,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AvailabilityStatus } from "@/components/ui/availability-indicator";
import { NavMenuItem } from "./nav/NavMenuItem";
import { UserProfileSection } from "./nav/UserProfileSection";

type Role = 'admin' | 'user' | 'moderator';

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
        role: (roleData?.role || 'user') as Role,
        status: (profileData.status as AvailabilityStatus) || 'offline'
      };
    },
    enabled: !!session?.user?.id,
  });

  const handleStatusChange = async (newStatus: AvailabilityStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', session?.user?.id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `You are now ${newStatus}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: "Please try again later",
      });
    }
  };

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
          <UserProfileSection 
            profile={profile}
            isExpanded={isExpanded}
            onProfileClick={() => navigate(`/profile/${session.user.id}`)}
            onStatusChange={handleStatusChange}
          />
        )}

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          if (item.requiresAdmin && profile?.role !== "admin") {
            return null;
          }

          if (item.requiresAuth && !session) {
            return null;
          }

          return (
            <NavMenuItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={isActive}
              onClick={() => navigate(item.path)}
            />
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