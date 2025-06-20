
import { motion } from "framer-motion";

export const BackgroundGradients = () => {
  return (
    <>
      {/* Primary divine gradient - deep cosmic colors */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/80 to-indigo-950/90"
        animate={{
          opacity: [0.85, 1, 0.85],
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      
      {/* Golden wealth overlay - Egyptian inspiration */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-yellow-600/10"
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ 
          duration: 16, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 3
        }}
      />
      
      {/* Rose gold love essence - Greek Aphrodite */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-rose-900/15 via-pink-800/10 to-transparent"
        animate={{
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 6
        }}
      />
      
      {/* Zen freedom mist - Japanese inspiration */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-bl from-cyan-900/10 via-transparent to-blue-900/15"
        animate={{
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 9
        }}
      />
    </>
  );
};
