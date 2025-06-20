
import { motion } from "framer-motion";

export const BackgroundGradients = () => {
  return (
    <>
      {/* Layered Background Gradients for Depth */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-purple-900/30 to-cyan-900/20"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 0.5, 0],
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
