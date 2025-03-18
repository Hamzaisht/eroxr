
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const VideoLoadingState = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black/50 z-10"
    >
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
        <p className="text-sm text-white/80">Loading video...</p>
      </div>
    </motion.div>
  );
};
