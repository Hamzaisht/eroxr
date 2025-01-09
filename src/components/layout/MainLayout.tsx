import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Users, Settings, MessageSquare, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Handle session persistence
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error || !currentSession) {
        navigate('/login');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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

  const sidebarWidth = isSidebarCollapsed ? "w-16" : "w-64";
  const mobileSidebarClass = isMobile 
    ? `fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
    : `fixed top-0 left-0 h-full z-50 transition-all duration-300 ${sidebarWidth}`;

  return (
    <div className="min-h-screen bg-luxury-dark flex">
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-luxury-dark/50 backdrop-blur-sm border border-luxury-neutral/10 rounded-full shadow-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isMobile ? (isMobileMenuOpen ? 256 : 0) : (isSidebarCollapsed ? 64 : 256),
          x: isMobile ? (isMobileMenuOpen ? 0 : -256) : 0
        }}
        className={`${mobileSidebarClass} bg-[#0D0D0D] border-r border-gray-800`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-luxury-primary text-xl font-bold truncate">
            {(!isSidebarCollapsed || (isMobile && isMobileMenuOpen)) && "Eroxr"}
          </h1>
        </div>

        {/* Menu Items */}
        <nav className="py-4">
          <AnimatePresence mode="wait">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                className="px-4 py-3 cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => {
                  item.onClick();
                  if (isMobile) setIsMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  {(!isSidebarCollapsed || (isMobile && isMobileMenuOpen)) && (
                    <div className="min-w-0">
                      <p className="text-gray-200 truncate">{item.title}</p>
                      <p className="text-sm text-gray-500 truncate">{item.subtitle}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-4 py-3 cursor-pointer hover:bg-gray-800/50 transition-colors mt-4"
              onClick={() => {
                handleLogout();
                if (isMobile) setIsMobileMenuOpen(false);
              }}
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-500 flex-shrink-0" />
                {(!isSidebarCollapsed || (isMobile && isMobileMenuOpen)) && (
                  <div className="min-w-0">
                    <p className="text-red-500 truncate">Logout</p>
                    <p className="text-sm text-gray-500 truncate">Sign out of your account</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </nav>

        {/* Collapse Button - Only show on desktop */}
        {!isMobile && (
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
        )}
      </motion.aside>

      {/* Overlay for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div 
        className={`flex-1 ${isMobile ? 'ml-0' : (isSidebarCollapsed ? 'ml-16' : 'ml-64')} transition-all duration-300`}
        onClick={() => isMobile && isMobileMenuOpen && setIsMobileMenuOpen(false)}
      >
        <main className="min-h-screen container-fluid py-4 sm:py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}