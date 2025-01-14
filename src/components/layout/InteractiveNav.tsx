import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Home, Heart, MessageSquare, Play, Film } from "lucide-react";
import { NavMenuItem } from "./nav/NavMenuItem";
import { UserProfileSection } from "./nav/UserProfileSection";

// Ensure unique menu items with distinct paths
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

  return (
    <motion.nav
      initial={false}
      animate={{ 
        width: isExpanded ? 240 : 80,
        transition: { duration: 0.3, ease: "easeInOut" }
      }}
      className="fixed left-0 top-0 h-screen bg-[#0D1117]/95 backdrop-blur-xl border-r border-luxury-primary/10 z-50 overflow-hidden"
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
              isExpanded={isExpanded}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>

        {session && <UserProfileSection isExpanded={isExpanded} />}
      </motion.div>
    </motion.nav>
  );
};