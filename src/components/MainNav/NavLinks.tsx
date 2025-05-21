
import { NavLink } from "react-router-dom";
import { Home, Heart, MessageSquare, Play, Film } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { CreateBodyContactDialog } from "@/components/ads/body-contact";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const NavItem = ({ to, icon: Icon, label, onClick }: NavItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `nav-item-liquid group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-500 ${
          isActive ? 'text-luxury-primary bg-luxury-primary/5' : 'text-white/60'
        }`
      }
      end
      onClick={handleClick}
    >
      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
      <motion.span 
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "auto" }}
        className="overflow-hidden whitespace-nowrap"
      >
        {label}
      </motion.span>
    </NavLink>
  );
};

export const NavLinks = () => {
  const [showBodyContactDialog, setShowBodyContactDialog] = useState(false);
  const location = useLocation();
  
  const handleCreateBD = () => {
    if (location.pathname === "/dating") {
      setShowBodyContactDialog(true);
    }
  };
  
  const handleSuccessfulAdCreation = () => {
    // Handle success logic if needed
    setShowBodyContactDialog(false);
  };

  // Ensure these match routes in App.tsx
  const navItems: NavItemProps[] = [
    { to: "/home", icon: Home, label: "Home" },
    { 
      to: "/dating", 
      icon: Heart, 
      label: "Create a BD",
      onClick: location.pathname === "/dating" ? handleCreateBD : undefined
    },
    { to: "/messages", icon: MessageSquare, label: "Messages" },
    { to: "/eroboard", icon: Play, label: "Eroboard" },
    { to: "/shorts", icon: Film, label: "Eros" }
  ];

  return (
    <>
      <nav className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
      
      <CreateBodyContactDialog 
        onSuccess={handleSuccessfulAdCreation} 
      />
    </>
  );
};
