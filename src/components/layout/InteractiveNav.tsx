
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Home, Heart, MessageSquare, Play, Film, Menu, Shield, Ghost } from "lucide-react";
import { NavMenuItem } from "./nav/NavMenuItem";
import { UserProfileSection } from "./nav/UserProfileSection";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAdminAuth } from "@/hooks/useAdminAuth";
// import { CreateBodyContactDialog } from "@/components/ads/body-contact"; // REMOVED - to be rebuilt 
import { useUser } from "@/hooks/useUser";

const menuItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Heart, label: "Dating", path: "/dating" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: Play, label: "Eroboard", path: "/eroboard" },
  { icon: Film, label: "Eros", path: "/shorts" }
].filter((item, index, self) => 
  index === self.findIndex((t) => t.path === item.path)
);

export const InteractiveNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSession();
  const { currentUser } = useUser();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isAdmin } = useAdminAuth();
  const isGhostMode = false; // Will be implemented with proper context
  
  // Add state for body contact dialog
  const [showBodyContactDialog, setShowBodyContactDialog] = useState(false);

  const handleSuccessfulAdCreation = () => {
    setShowBodyContactDialog(false);
  };
  
  const handleItemClick = (path: string, label: string) => {
    navigate(path);
    // Close mobile menu if it's open
    const closeButton = document.querySelector('[data-radix-collection-item]') as HTMLElement;
    if (closeButton && isMobile) closeButton.click();
  };

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="fixed top-3 left-4 z-50 md:hidden bg-white/5 hover:bg-white/10 backdrop-blur-lg"
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] max-w-[300px] bg-gradient-to-b from-[#0D1117]/95 via-[#161B22]/95 to-[#0D1117]/95 backdrop-blur-xl border-luxury-primary/10 p-4">
        <div className="flex flex-col h-full py-6 sm:py-8">
          <motion.div
            className="px-4 mb-6 sm:mb-8"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/")}
          >
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent cursor-pointer">
              Eroxr
            </h1>
          </motion.div>

          <div className="space-y-1 sm:space-y-2 px-4">
            {menuItems.map((item) => (
              <NavMenuItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={location.pathname === item.path}
                isExpanded={true}
                onClick={() => handleItemClick(item.path, item.label)}
              />
            ))}
            {isAdmin && (
              <NavMenuItem
                icon={Shield}
                label="Platform Control"
                path="/admin/features"
                isActive={location.pathname === '/admin/features'}
                isExpanded={true}
                onClick={() => {
                  navigate('/admin/features');
                  const closeButton = document.querySelector('[data-radix-collection-item]') as HTMLElement;
                  if (closeButton) closeButton.click();
                }}
              />
            )}
          </div>

          <UserProfileSection isExpanded={true} currentUser={currentUser} />
        </div>
      </SheetContent>
    </Sheet>
  );

  const DesktopNav = () => (
    <motion.nav
      initial={false}
      animate={{ 
        width: isExpanded ? 240 : 80,
        transition: { duration: 0.3, ease: "easeInOut" }
      }}
      className={cn(
        "fixed left-0 top-0 h-screen z-50 hidden md:block",
        "bg-gradient-to-b from-[#0D1117]/95 via-[#161B22]/95 to-[#0D1117]/95",
        "backdrop-blur-xl border-r border-luxury-primary/10",
        "overflow-hidden transition-all duration-300"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <motion.div 
        className="flex flex-col h-full py-8"
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Link to="/">
          <motion.div
            className="px-4 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <h1 className={cn(
              "font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary",
              "bg-clip-text text-transparent cursor-pointer transition-all duration-300",
              isExpanded ? "text-2xl" : "text-xl text-center"
            )}>
              {isExpanded ? "Eroxr" : "E"}
            </h1>
          </motion.div>
        </Link>

        <div className="space-y-2 px-4">
          {menuItems.map((item) => (
            <NavMenuItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname === item.path}
              isExpanded={isExpanded}
              onClick={() => handleItemClick(item.path, item.label)}
            />
          ))}
          {isAdmin && (
            <NavMenuItem
              icon={Shield}
              label="Platform Control"
              path="/admin/features"
              isActive={location.pathname === '/admin/features'}
              isExpanded={isExpanded}
              onClick={() => navigate('/admin/features')}
            />
          )}
        </div>

        <UserProfileSection isExpanded={isExpanded} currentUser={currentUser} />
      </motion.div>
    </motion.nav>
  );

  return (
    <>
      <MobileNav />
      <DesktopNav />
      {isAdmin && (
        <>
          <Button
            variant="destructive"
            size="sm"
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2"
            onClick={() => navigate('/admin')}
          >
            <Shield className="w-4 h-4" />
            {!isMobile && "Admin Panel"}
          </Button>
          
          {isGhostMode && (
            <div className="fixed bottom-16 left-4 z-50 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white border border-purple-500/30 shadow-lg flex items-center space-x-1">
              <Ghost className="h-3.5 w-3.5 text-purple-400" />
              <span>Ghost Mode Active</span>
            </div>
          )}
        </>
      )}
      
      {/* Create BD Dialog - TO BE REBUILT */}
      {showBodyContactDialog && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p>Create BD Ad Dialog - Coming Soon (to be rebuilt from scratch)</p>
            <button onClick={() => setShowBodyContactDialog(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};
