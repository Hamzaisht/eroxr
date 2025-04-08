
import { Loader2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

export const VideoLoadingState = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-luxury-darker/70 backdrop-blur-sm z-10"
    >
      <Loader2 className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} animate-spin text-luxury-primary mb-2`} />
      <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-luxury-neutral/70`}>Loading media...</span>
    </motion.div>
  );
};
