import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Grid, Info, Search, Settings, User, Menu } from "lucide-react";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Grid, label: "Categories", path: "/categories" },
  { icon: Info, label: "About", path: "/about" },
  { icon: Search, label: "Explore", path: "/search" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: User, label: "Profile", path: "/profile" },
];

export const InteractiveNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.nav
      initial={false}
      animate={{ width: isExpanded ? 240 : 80 }}
      className="fixed left-0 top-0 h-screen bg-luxury-dark/50 backdrop-blur-xl border-r border-luxury-primary/10 z-50"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col h-full py-8">
        <motion.div 
          className="px-6 mb-8"
          animate={{ opacity: isExpanded ? 1 : 0.5 }}
        >
          <Menu className="w-6 h-6 text-luxury-primary" />
        </motion.div>

        <div className="flex-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors relative group ${
                  isActive 
                    ? "text-luxury-primary bg-luxury-primary/10" 
                    : "text-luxury-neutral/60 hover:text-luxury-primary hover:bg-luxury-primary/5"
                }`}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-5 h-5" />
                <motion.span
                  className="ml-4 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isExpanded ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
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
      </div>
    </motion.nav>
  );
};