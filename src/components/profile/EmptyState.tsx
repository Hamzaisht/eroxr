import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
}

export const EmptyState = ({ icon: Icon, message }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center text-luxury-neutral/70 p-12 rounded-2xl border border-luxury-primary/20 bg-luxury-dark/30 backdrop-blur-sm"
    >
      <Icon className="w-12 h-12 mx-auto mb-4 text-luxury-primary animate-pulse" />
      <p className="text-lg">{message}</p>
    </motion.div>
  );
};