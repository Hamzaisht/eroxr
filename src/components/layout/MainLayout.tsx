import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Users, Settings, MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast({
        title: "Logged out successfully",
        description: "See you soon!",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Please try again",
      });
    }
  };

  const menuItems = [
    {
      title: "Dating Ads",
      subtitle: "Browse dating profiles",
      icon: Users,
      onClick: () => navigate('/categories'),
    },
    {
      title: "Profile",
      subtitle: "View your profile",
      icon: Users,
      onClick: () => navigate('/profile'),
    },
    {
      title: "Messages",
      subtitle: "Check your messages",
      icon: MessageSquare,
      onClick: () => navigate('/messages'),
    },
    {
      title: "Settings",
      subtitle: "Manage your account",
      icon: Settings,
      onClick: () => navigate('/settings'),
    },
  ];

  return (
    <div className="min-h-screen bg-luxury-dark flex">
      <motion.div
        initial={false}
        animate={{ width: isSidebarCollapsed ? "64px" : "256px" }}
        className="relative bg-[#0D0D0D] border-r border-gray-800 min-h-screen"
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-luxury-primary text-xl font-bold">Eroxr</h1>
        </div>

        {/* Menu Items */}
        <div className="py-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              className="px-4 py-3 cursor-pointer hover:bg-gray-800/50 transition-colors"
              onClick={item.onClick}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-gray-400" />
                {!isSidebarCollapsed && (
                  <div>
                    <p className="text-gray-200">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.subtitle}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Logout Button */}
          <motion.div
            className="px-4 py-3 cursor-pointer hover:bg-gray-800/50 transition-colors mt-4"
            onClick={handleLogout}
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-500" />
              {!isSidebarCollapsed && (
                <div>
                  <p className="text-red-500">Logout</p>
                  <p className="text-sm text-gray-500">Sign out of your account</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-8 z-50 bg-luxury-dark/50 backdrop-blur-sm border border-luxury-neutral/10 rounded-full shadow-lg"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </motion.div>

      <div className="flex-1 bg-luxury-dark">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};