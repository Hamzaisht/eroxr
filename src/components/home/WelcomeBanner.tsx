
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface WelcomeBannerProps {
  username?: string;
  onDismiss?: () => void;
}

export const WelcomeBanner = ({ username, onDismiss }: WelcomeBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onDismiss?.();
      }, 300); // Wait for animation to complete
    }, 2000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleManualDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ 
            opacity: 0, 
            y: -100, 
            scale: 0.95,
            transition: { duration: 0.3, ease: "easeInOut" }
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.5
          }}
          className="relative mb-8 p-6 bg-gradient-to-r from-luxury-primary/10 to-luxury-accent/10 rounded-2xl border border-luxury-primary/20 backdrop-blur-sm overflow-hidden"
        >
          {/* Background particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-luxury-primary/30 rounded-full"
                initial={{ 
                  x: Math.random() * 100 + '%', 
                  y: Math.random() * 100 + '%',
                  scale: 0 
                }}
                animate={{ 
                  x: Math.random() * 100 + '%', 
                  y: Math.random() * 100 + '%',
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleManualDismiss}
            className="absolute top-4 right-4 p-1 rounded-full bg-luxury-primary/20 hover:bg-luxury-primary/30 transition-colors"
          >
            <X className="h-4 w-4 text-luxury-neutral" />
          </motion.button>

          {/* Content */}
          <div className="text-center space-y-3 relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent font-display"
            >
              Welcome back{username ? `, ${username}` : ''}!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-luxury-muted text-lg"
            >
              Ready to create and discover amazing content?
            </motion.p>
          </div>

          {/* Auto-dismiss progress bar */}
          <motion.div 
            className="absolute bottom-0 left-0 h-1 bg-luxury-primary/60 rounded-full"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 2, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
