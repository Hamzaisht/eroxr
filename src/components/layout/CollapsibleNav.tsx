import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Home, Heart, MessageSquare, Play, Film, Menu, X, Shield, Ghost } from "lucide-react";
import { NavMenuItem } from "./nav/NavMenuItem";
import { UserProfileSection } from "./nav/UserProfileSection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { useGhostMode } from "@/hooks/useGhostMode";
import { useUser } from "@/hooks/useUser";

const menuItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Heart, label: "Dating", path: "/dating" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: Play, label: "Eroboard", path: "/eroboard" },
  { icon: Film, label: "Eros", path: "/shorts" }
];

export const CollapsibleNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSession();
  const { currentUser } = useUser();
  const { isSuperAdmin } = useSuperAdminCheck();
  const { isGhostMode } = useGhostMode();

  const handleItemClick = (path: string) => {
    navigate(path);
    setIsExpanded(false);
  };

  const toggleNav = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.div
        className="fixed top-4 left-4 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleNav}
          className={cn(
            "w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-lg border border-primary/20 text-white",
            "transition-all duration-300 hover:scale-110"
          )}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isExpanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.div>
        </Button>
      </motion.div>

      {/* Navigation Panel */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsExpanded(false)}
            />

            {/* Navigation Content */}
            <motion.nav
              className="fixed left-0 top-0 h-full w-80 z-50 bg-gradient-to-b from-[#0D1117]/95 via-[#161B22]/95 to-[#0D1117]/95 backdrop-blur-xl border-r border-primary/20"
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex flex-col h-full py-8 px-6">
                {/* Logo */}
                <motion.div
                  className="mb-8 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleItemClick("/")}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                    Eroxr
                  </h1>
                </motion.div>

                {/* Menu Items */}
                <div className="space-y-2 flex-1">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <NavMenuItem
                        icon={item.icon}
                        label={item.label}
                        path={item.path}
                        isActive={location.pathname === item.path}
                        isExpanded={true}
                        onClick={() => handleItemClick(item.path)}
                      />
                    </motion.div>
                  ))}

                  {isSuperAdmin && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + menuItems.length * 0.05 }}
                    >
                      <NavMenuItem
                        icon={Shield}
                        label="Platform Control"
                        path="/admin/features"
                        isActive={location.pathname === '/admin/features'}
                        isExpanded={true}
                        onClick={() => handleItemClick('/admin/features')}
                      />
                    </motion.div>
                  )}
                </div>

                {/* User Profile Section */}
                {session && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <UserProfileSection isExpanded={true} currentUser={currentUser} />
                  </motion.div>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Admin Badge */}
      {isSuperAdmin && (
        <motion.div
          className="fixed bottom-4 right-4 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2 backdrop-blur-lg"
            onClick={() => navigate('/admin')}
          >
            <Shield className="w-4 h-4" />
            Admin Panel
          </Button>
        </motion.div>
      )}

      {/* Ghost Mode Indicator */}
      {isGhostMode && (
        <motion.div
          className="fixed bottom-20 left-4 z-50 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white border border-purple-500/30 shadow-lg flex items-center space-x-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Ghost className="h-3.5 w-3.5 text-purple-400" />
          <span>Ghost Mode Active</span>
        </motion.div>
      )}
    </>
  );
};