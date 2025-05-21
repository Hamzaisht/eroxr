
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface UploadShortButtonProps {
  onUploadClick: () => void;
}

export const UploadShortButton: React.FC<UploadShortButtonProps> = ({ onUploadClick }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button 
        onClick={onUploadClick}
        size="lg" 
        className="rounded-full h-14 w-14 shadow-lg bg-luxury-primary hover:bg-luxury-secondary transition-colors"
      >
        <Plus className="h-7 w-7" />
      </Button>
    </motion.div>
  );
};

export default UploadShortButton;
