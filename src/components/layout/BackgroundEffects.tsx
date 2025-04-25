
import { memo } from "react";
import { motion } from "framer-motion";

export const BackgroundEffects = memo(() => {
  return (
    <>
      {/* Grid pattern with optimized masking */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_80%)] opacity-5 pointer-events-none" />
      </div>
      
      {/* Animated gradients with better performance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.1,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-luxury-primary/10 blur-3xl"
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.1,
            scale: [1, 1.15, 1],
          }}
          transition={{ 
            duration: 7,
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-luxury-accent/10 blur-3xl"
        />
      </div>
    </>
  );
});

BackgroundEffects.displayName = "BackgroundEffects";

export default BackgroundEffects;
