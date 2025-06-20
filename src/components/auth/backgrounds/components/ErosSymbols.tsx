
import { motion } from "framer-motion";

export const ErosSymbols = () => {
  return (
    <>
      {/* Single subtle brand symbol */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-32 h-32 opacity-4"
        animate={{ 
          rotate: [0, 360],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ 
          rotate: { duration: 60, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle 
            cx="50" 
            cy="50" 
            r="25" 
            fill="none" 
            stroke="rgba(59, 130, 246, 0.3)" 
            strokeWidth="2"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="15" 
            fill="none" 
            stroke="rgba(139, 92, 246, 0.2)" 
            strokeWidth="1"
          />
        </svg>
      </motion.div>
    </>
  );
};
