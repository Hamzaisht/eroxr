import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface FloatingMenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  index: number;
}

export const FloatingMenuItem = ({ icon: Icon, label, onClick, index }: FloatingMenuItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-end gap-2"
    >
      <span className="bg-black/80 text-white px-3 py-1 rounded-lg text-sm">
        {label}
      </span>
      <Button
        onClick={onClick}
        size="icon"
        className="bg-luxury-primary hover:bg-luxury-primary/80"
      >
        <Icon className="h-5 w-5" />
      </Button>
    </motion.div>
  );
};