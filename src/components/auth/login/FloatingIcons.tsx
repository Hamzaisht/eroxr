
import { motion } from "framer-motion";
import { Sparkles, Shield, Zap } from "lucide-react";

export const FloatingIcons = () => {
  return (
    <div className="flex justify-center items-center gap-4 mb-6">
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles className="w-8 h-8 text-cyan-400" />
      </motion.div>
      <motion.div
        animate={{ 
          y: [0, -8, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <Shield className="w-8 h-8 text-purple-400" />
      </motion.div>
      <motion.div
        animate={{ 
          rotate: [0, -10, 10, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ 
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Zap className="w-8 h-8 text-pink-400" />
      </motion.div>
    </div>
  );
};
