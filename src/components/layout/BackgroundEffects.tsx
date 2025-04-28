
import { memo } from "react";
import { motion } from "framer-motion";

export const BackgroundEffects = memo(() => {
  return (
    <>
      {/* Grid pattern with optimized masking */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_80%)] opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-dark/50 via-luxury-darker/30 to-luxury-dark/50" />
      </div>
      
      {/* Animated gradient orbs with better performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.15, 0.1],
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
            opacity: [0.1, 0.15, 0.1],
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

      {/* Subtle grain texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
});

BackgroundEffects.displayName = "BackgroundEffects";

export default BackgroundEffects;
