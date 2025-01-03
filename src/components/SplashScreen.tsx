import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-32 h-32"
          >
            <motion.img
              src="/placeholder.svg"
              alt="Eroxr"
              className="w-full h-full object-contain animate-logo-spin"
              style={{ filter: "brightness(0) invert(1) sepia(1) saturate(10000%) hue-rotate(330deg)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-600 mix-blend-overlay opacity-50" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};