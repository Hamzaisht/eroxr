
import { motion } from "framer-motion";
import { memo } from "react";

export const HeroFeaturePreview = memo(() => {
  return (
    <motion.div 
      className="w-full h-full flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      <div className="relative">
        {/* Glow effect around the preview */}
        <div className="absolute inset-0 bg-luxury-primary/20 rounded-xl blur-2xl" />
        
        {/* Main feature preview card */}
        <motion.div 
          className="relative z-10 bg-luxury-dark/40 backdrop-blur-md border border-luxury-primary/30 rounded-xl overflow-hidden shadow-xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 6,
            ease: "easeInOut"
          }}
        >
          {/* Sample platform UI preview */}
          <div className="w-full aspect-[16/9] min-w-[320px] sm:min-w-[380px] md:min-w-[450px] lg:min-w-[500px]">
            <img
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
              alt="Eroxr platform preview"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-darker/80 via-transparent to-transparent" />
            
            {/* Sample creator card floating on top */}
            <div className="absolute bottom-4 right-4 left-4 bg-luxury-dark/80 backdrop-blur-md border border-luxury-primary/20 rounded-lg p-3 flex items-center">
              <div className="w-10 h-10 rounded-full bg-luxury-primary/30 mr-3 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956"
                  alt="Creator avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white">Emma Creator</h4>
                <p className="text-xs text-luxury-neutral/70">12.5K subscribers</p>
              </div>
              <motion.button
                className="bg-luxury-primary text-white text-xs px-3 py-1 rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Follow
              </motion.button>
            </div>
          </div>
          
          {/* Video icon for play indication */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="w-16 h-16 bg-luxury-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center"
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(181, 99, 255, 0.7)",
                  "0 0 0 15px rgba(181, 99, 255, 0)",
                ]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polygon points="6 3 20 12 6 21"></polygon></svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});

HeroFeaturePreview.displayName = "HeroFeaturePreview";

export default HeroFeaturePreview;
