import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface NavMenuItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

export const NavMenuItem = ({ icon: Icon, label, isActive, isExpanded, onClick }: NavMenuItemProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative group 
        ${isActive 
          ? "text-luxury-primary bg-gradient-to-r from-luxury-primary/10 to-luxury-accent/10" 
          : "text-white/60 hover:text-white"
        }
        before:absolute before:inset-0 before:rounded-lg before:opacity-0 before:transition-opacity
        before:bg-gradient-to-r before:from-luxury-primary/20 before:to-luxury-accent/20
        hover:before:opacity-100
      `}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Icon className="w-5 h-5 flex-shrink-0 relative z-10" />
      {isExpanded && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="font-medium whitespace-nowrap relative z-10"
        >
          {label}
        </motion.span>
      )}
      {isActive && (
        <motion.div
          className="absolute left-0 w-1 h-full bg-gradient-to-b from-luxury-primary to-luxury-accent rounded-full"
          layoutId="activeIndicator"
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};