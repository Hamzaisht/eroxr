
import { motion } from "framer-motion";

export const BackgroundGradients = () => {
  return (
    <>
      {/* Primary subtle gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"
        animate={{
          opacity: [0.9, 1, 0.9],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      
      {/* Subtle accent overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-purple-900/5"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      />
    </>
  );
};
