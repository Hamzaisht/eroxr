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
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative group 
        ${isActive 
          ? "text-luxury-primary bg-gradient-to-r from-luxury-primary/10 to-luxury-accent/10" 
          : "text-white/60 hover:text-white"
        }
        before:absolute before:inset-0 before:rounded-lg before:opacity-0 
        before:transition-all before:duration-500 before:ease-out
        before:bg-[radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(155,135,245,0.15),transparent_40%)]
        hover:before:opacity-100
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onMouseMove={(e) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        button.style.setProperty('--mouse-x', `${x}px`);
        button.style.setProperty('--mouse-y', `${y}px`);
      }}
    >
      <Icon className="w-5 h-5 flex-shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110" />
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
      <div className="absolute inset-0 rounded-lg transition-all duration-300 group-hover:bg-luxury-primary/5" />
    </motion.button>
  );
};