
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface AnimatedSubmitButtonProps {
  isLoading: boolean;
}

export const AnimatedSubmitButton = ({ isLoading }: AnimatedSubmitButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.4 }}
    >
      <motion.div
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 20px 40px rgba(217, 70, 239, 0.3)" 
        }}
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        <Button
          type="submit"
          className="w-full h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-semibold text-lg rounded-xl transition-all duration-500 transform disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          disabled={isLoading}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <motion.div 
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Creating your account...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Create Account</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </>
            )}
          </span>
        </Button>
      </motion.div>
    </motion.div>
  );
};
