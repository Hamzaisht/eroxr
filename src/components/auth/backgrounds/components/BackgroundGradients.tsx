
import { motion } from "framer-motion";

export const BackgroundGradients = () => {
  return (
    <>
      {/* Divine Realm Background - Multiple ethereal layers */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/40 to-rose-900/30"
        animate={{
          scale: [1, 1.02, 1],
          rotate: [0, 0.3, 0],
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      
      {/* Love's Awakening - Pink to golden dawn */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-pink-900/20 via-purple-800/25 to-amber-700/15"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [0.98, 1.03, 0.98],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Desire's Fire - Passionate reds and oranges */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-bl from-red-900/15 via-orange-800/20 to-pink-900/25"
        animate={{
          rotate: [0, -0.5, 0],
          scale: [1.01, 0.99, 1.01],
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 4
        }}
      />
    </>
  );
};
