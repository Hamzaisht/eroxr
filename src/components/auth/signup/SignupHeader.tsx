import { motion } from "framer-motion";

export const SignupHeader = () => {
  return (
    <div className="text-center space-y-2">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent"
      >
        Join EROXR
      </motion.h2>
      <p className="text-luxury-neutral/80">Create your account</p>
    </div>
  );
};