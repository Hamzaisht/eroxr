import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-luxury-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        {children}
      </motion.div>
    </div>
  );
};