import { motion } from "framer-motion";

export const AuthHeader = () => {
  return (
    <div className="text-center space-y-4 mb-8">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent"
      >
        Welcome to EROXR
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-luxury-neutral/80"
      >
        Your premium social platform
      </motion.p>
    </div>
  );
};