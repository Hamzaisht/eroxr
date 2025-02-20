
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Home, Heart, MessageSquare, Play, Film, Menu, X, Shield } from "lucide-react";
import { NavMenuItem } from "./nav/NavMenuItem";
import { UserProfileSection } from "./nav/UserProfileSection";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Heart, label: "Create a BD", path: "/dating" },
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
  const isMobile = window.innerWidth <= 768;

  // Check if user is super admin
  const isGodMode = session?.user?.email === 'hamzaishtiaq242@gmail.com';

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="fixed top-3 left-4 z-50 md:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] bg-gradient-to-b from-[#0D1117]/95 via-[#161B22]/95 to-[#0D1117]/95 backdrop-blur-xl border-luxury-primary/10">
        <div className="flex flex-col h-full py-8">
          <motion.div
            className="px-4 mb-8"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/")}
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent cursor-pointer">
              Eroxr
            </h1>
          </motion.div>

          <div className="space-y-2 px-4">
            {menuItems.map((item) => (
              <NavMenuItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={location.pathname === item.path}
                isExpanded={true}
                onClick={() => navigate(item.path)}
              />
            ))}
            {isGodMode && (
              <NavMenuItem
                icon={Shield}
                label="Platform Control"
                path="/admin/features"
                isActive={location.pathname === '/admin/features'}
                isExpanded={true}
                onClick={() => navigate('/admin/features')}
              />
            )}
          </div>

          {session && <UserProfileSection isExpanded={true} />}
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
      className="fixed left-0 top-0 h-screen bg-gradient-to-b from-[#0D1117]/95 via-[#161B22]/95 to-[#0D1117]/95 backdrop-blur-xl border-r border-luxury-primary/10 z-50 overflow-hidden hidden md:block"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <motion.div 
        className="flex flex-col h-full py-8"
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="px-4 mb-8"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent cursor-pointer">
            {isExpanded ? "Eroxr" : "E"}
          </h1>
        </motion.div>

        <div className="space-y-2 px-4">
          {menuItems.map((item) => (
            <NavMenuItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname === item.path}
              isExpanded={isExpanded}
              onClick={() => navigate(item.path)}
            />
          ))}
          {isGodMode && (
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

        {session && <UserProfileSection isExpanded={isExpanded} />}
      </motion.div>
    </motion.nav>
  );

  return (
    <>
      <MobileNav />
      <DesktopNav />
      {isGodMode && (
        <Button
          variant="destructive"
          size="sm"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2"
          onClick={() => navigate('/admin/features')}
        >
          <Shield className="w-4 h-4" />
          {!isMobile && "God Mode"}
        </Button>
      )}
    </>
  );
};
