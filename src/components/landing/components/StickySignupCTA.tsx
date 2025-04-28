
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';

export const StickySignupCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down 60% of viewport height
      const scrollThreshold = window.innerHeight * 0.6;
      if (window.scrollY > scrollThreshold && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);
  
  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4 sm:px-0"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30
          }}
        >
          <div className="relative w-full rounded-xl bg-gradient-to-r from-luxury-primary/90 to-luxury-accent/90 backdrop-blur-lg border border-white/10 shadow-premium p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            
            <div className="text-center sm:text-left">
              <p className="font-medium mb-1 text-sm">Ready to get started?</p>
              <p className="text-xs text-white/80">Join 50,000+ creators on EROXR</p>
            </div>
            
            <Link 
              to="/register"
              className="w-full sm:w-auto px-4 py-2 bg-white text-luxury-primary font-medium text-sm rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2 group"
            >
              Sign Up Free
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {/* Pulsing effect */}
            <div className="absolute -inset-px rounded-xl opacity-0 animate-pulse-ring bg-white/20" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
