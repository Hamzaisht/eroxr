import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Home, Video, Users, Heart } from "lucide-react";
import { NavMenuItem } from "./nav/NavMenuItem";
import { UserProfileSection } from "./nav/UserProfileSection";

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
      </div>
    </motion.nav>
  );
};