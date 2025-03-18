
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 p-8 rounded-xl bg-luxury-darker/50 backdrop-blur-md border border-luxury-primary/10 shadow-xl"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-16 h-16 rounded-full border-4 border-luxury-primary/20 border-t-luxury-primary shadow-lg"></div>
          <Loader2 className="w-16 h-16 text-luxury-primary absolute top-0 left-0 animate-pulse" />
        </motion.div>
        <div className="space-y-1 text-center">
          <p className="text-lg font-medium text-luxury-neutral">Loading your experience...</p>
          <p className="text-sm text-luxury-muted">Preparing your content</p>
        </div>
      </motion.div>
    </div>
  );
};
