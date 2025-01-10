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
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative group ${
        isActive 
          ? "text-luxury-primary bg-luxury-primary/10" 
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {isExpanded && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="font-medium whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
      {isActive && (
        <motion.div
          className="absolute left-0 w-1 h-full bg-luxury-primary rounded-full"
          layoutId="activeIndicator"
        />
      )}
    </motion.button>
  );
};