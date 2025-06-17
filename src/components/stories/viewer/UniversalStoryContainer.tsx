
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface UniversalStoryContainerProps {
  children: ReactNode;
  className?: string;
}

export const UniversalStoryContainer = ({ children, className = "" }: UniversalStoryContainerProps) => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[200]">
      {/* Universal 9:16 container - Snapchat standard */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`relative w-full h-full max-w-[100vh] mx-auto bg-black overflow-hidden ${className}`}
        style={{
          aspectRatio: '9/16',
          maxHeight: '100vh',
          maxWidth: 'min(100vw, calc(100vh * 9/16))'
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
