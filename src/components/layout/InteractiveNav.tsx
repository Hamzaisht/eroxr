import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Home, Video, Heart, BarChart2 } from "lucide-react";
import { NavMenuItem } from "./nav/NavMenuItem";
import { UserProfileSection } from "./nav/UserProfileSection";

const menuItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Video, label: "Eros Shorts", path: "/shorts" },
  { icon: Heart, label: "Dating Ads", path: "/dating" },
  { icon: BarChart2, label: "Eroboard", path: "/eroboard" }
];

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