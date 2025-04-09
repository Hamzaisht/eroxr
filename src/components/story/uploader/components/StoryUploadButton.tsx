
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export const StoryUploadButton = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <motion.div 
        className="bg-luxury-primary/20 p-2 rounded-full mb-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-5 h-5 text-luxury-primary" />
      </motion.div>
      <span className="text-xs text-luxury-neutral/80 text-center">
        Add Story
      </span>
    </div>
  );
};
