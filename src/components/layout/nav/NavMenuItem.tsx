import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface NavMenuItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

export const NavMenuItem = ({ icon: Icon, label, isActive, onClick }: NavMenuItemProps) => {
  return (
    <motion.button
      onClick={onClick}
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
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
      {isActive && (
        <motion.div
          className="absolute left-0 w-1 h-full bg-luxury-primary rounded-full"
          layoutId="activeIndicator"
        />
      )}
    </motion.button>
  );
};