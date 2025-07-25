import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Heart, MessageSquare, Play, Film } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Heart, label: "Dating", path: "/dating" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: Play, label: "Eroboard", path: "/eroboard" },
  { icon: Film, label: "Eros", path: "/shorts" }
];

export const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-luxury-darker/95 backdrop-blur-xl border-t border-luxury-primary/10 px-2 py-2 safe-area-pb"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-luxury-primary/20 text-luxury-primary" 
                  : "text-luxury-neutral/60 hover:text-luxury-neutral hover:bg-luxury-primary/10"
              )}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <Icon className={cn(
                "h-5 w-5 transition-all duration-200",
                isActive ? "text-luxury-primary" : "text-luxury-neutral/60"
              )} />
              <span className={cn(
                "text-xs mt-1 font-medium transition-all duration-200",
                isActive ? "text-luxury-primary" : "text-luxury-neutral/60"
              )}>
                {item.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-luxury-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};