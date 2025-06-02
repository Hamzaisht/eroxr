
import { motion } from "framer-motion";
import { Rocket, Stars, Crown } from "lucide-react";

export const FloatingIcons = () => {
  return (
    <div className="flex justify-center items-center gap-4 mb-6">
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Rocket className="w-8 h-8 text-pink-400" />
      </motion.div>
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <Crown className="w-8 h-8 text-purple-400" />
      </motion.div>
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Stars className="w-8 h-8 text-cyan-400" />
      </motion.div>
    </div>
  );
};
