
import { motion } from "framer-motion";

export const BackgroundGradients = () => {
  return (
    <>
      {/* Vanta Black background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle gradient overlay for depth */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black opacity-50"
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
    </>
  );
};
