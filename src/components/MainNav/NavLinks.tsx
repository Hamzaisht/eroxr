import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export const NavLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const links = [
    { path: "/home", label: "Home" },
    { path: "/categories", label: "Categories" },
    { path: "/about", label: "About" },
  ];
  
  return (
    <div className="hidden md:flex items-center gap-2">
      {links.map((link, index) => (
        <motion.div
          key={link.path}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button 
            variant={isActive(link.path) ? "default" : "ghost"} 
            onClick={() => navigate(link.path)}
            className={`
              relative px-4 py-2 transition-all duration-300
              ${isActive(link.path) 
                ? 'bg-gradient-to-r from-luxury-primary to-luxury-accent text-white' 
                : 'text-luxury-neutral hover:text-luxury-primary hover:bg-luxury-primary/10'}
            `}
          >
            {link.label}
            {isActive(link.path) && (
              <motion.div
                layoutId="active-nav"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-luxury-primary to-luxury-accent"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};