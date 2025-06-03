
import { motion } from "framer-motion";

interface SignupFooterProps {
  onToggleMode: () => void;
  isLoginMode?: boolean;
}

export const SignupFooter = ({ onToggleMode, isLoginMode = false }: SignupFooterProps) => {
  return (
    <motion.div 
      className="text-center space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <p className="text-sm text-gray-400">
        {isLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
        <motion.button
          onClick={onToggleMode}
          className="relative text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-medium group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">{isLoginMode ? "Sign up" : "Sign in"}</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-lg blur-sm"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.2, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </p>
      
      <motion.div
        className="flex items-center justify-center gap-2 text-xs text-gray-500"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.div
          className="w-1 h-1 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <span>{isLoginMode ? "Welcome back to the experience" : "Premium experience awaits"}</span>
        <motion.div
          className="w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>
    </motion.div>
  );
};
