import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Home, Video, Users, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const menuItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Video, label: "Eros Shorts", path: "/shorts" },
  { icon: Users, label: "Categories", path: "/categories" },
  { icon: Heart, label: "Dating Ads", path: "/dating" }
];

export const InteractiveNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSession();
  const { toast } = useToast();

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
        <div className="space-y-2 px-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative group ${
                  isActive 
                    ? "text-luxury-primary bg-luxury-primary/10" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
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

        {session && (
          <motion.div 
            className="mt-auto px-4"
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