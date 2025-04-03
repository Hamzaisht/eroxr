
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SidebarLinkProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "primary" | "danger";
}

export const SidebarLink = ({ icon: Icon, label, onClick, variant = "default" }: SidebarLinkProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "hover:bg-luxury-primary/10 text-luxury-primary";
      case "danger":
        return "hover:bg-red-500/10 text-red-500";
      default:
        return "hover:bg-luxury-neutral/5 text-luxury-neutral";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${getVariantClasses()}`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </motion.div>
  );
};
