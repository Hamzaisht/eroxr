
import { motion } from "framer-motion";

interface WaveButtonProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const WaveButton = ({ children, className = "", ...props }: WaveButtonProps) => {
  return (
    <motion.button 
      className={`relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition-all duration-300 ease-out rounded-full group ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-500 -translate-x-full bg-gradient-to-r from-luxury-primary to-luxury-accent group-hover:translate-x-0 ease transform">
        <motion.svg 
          className="w-6 h-6"
          initial={{ x: -5 }}
          animate={{ x: 0 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 10,
            delay: 0.1
          }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </motion.svg>
      </span>
      <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
        {children}
      </span>
      <span className="relative invisible">{children}</span>
    </motion.button>
  );
};
