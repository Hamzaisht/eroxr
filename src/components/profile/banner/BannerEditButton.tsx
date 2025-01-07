import { PencilIcon } from "lucide-react";
import { motion } from "framer-motion";

interface BannerEditButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

export const BannerEditButton = ({ onClick }: BannerEditButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-4 right-4 bg-luxury-primary hover:bg-luxury-primary/90 p-3 rounded-full flex items-center justify-center shadow-luxury cursor-pointer z-30 backdrop-blur-sm"
      onClick={onClick}
    >
      <PencilIcon className="w-6 h-6 text-white" />
    </motion.div>
  );
};