
import { motion } from "framer-motion";
import { FloatingIcons } from "./FloatingIcons";

export const AnimatedHeader = () => {
  return (
    <motion.div
      className="text-center space-y-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      <FloatingIcons />

      <motion.h1 
        className="text-5xl font-bold relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.span
          className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            backgroundSize: '200% auto',
          }}
        >
          Welcome Back
        </motion.span>
        
        {/* Floating sparkles around text */}
        <motion.div
          className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute -bottom-1 -left-3 w-2 h-2 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full"
          animate={{
            scale: [0, 1.3, 0],
            opacity: [0, 0.8, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: 1,
          }}
        />
      </motion.h1>
      
      <motion.p 
        className="text-gray-300 text-lg relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Sign in to your{" "}
        <motion.span
          className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-semibold"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            backgroundSize: '200% auto',
          }}
        >
          premium account
        </motion.span>
      </motion.p>
    </motion.div>
  );
};
