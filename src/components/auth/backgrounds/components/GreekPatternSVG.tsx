
import { motion } from "framer-motion";

export const GreekPatternSVG = () => {
  return (
    <div className="absolute inset-0">
      <svg
        className="absolute inset-0 w-full h-full opacity-15"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Advanced Greek Key Pattern */}
          <pattern
            id="erosGreekPattern"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <path
                d="M10,10 L50,10 L50,20 L20,20 L20,40 L50,40 L50,50 L10,50 L10,40 L40,40 L40,20 L10,20 Z"
                stroke="url(#erosGradient1)"
                strokeWidth="1.5"
                fill="none"
                opacity="0.7"
              />
              <path
                d="M0,25 L15,25 L15,35 L25,35 L25,15 L35,15 L35,45 L15,45 L15,55 L5,55 L5,35 L0,35 Z"
                stroke="url(#erosGradient2)"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />
            </motion.g>
          </pattern>

          {/* Multiple Gradient Definitions */}
          <linearGradient id="erosGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <radialGradient id="erosGradient2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#ec4899" />
          </radialGradient>
          <linearGradient id="erosGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#erosGreekPattern)" />
        
        {/* Overlapping Pattern Layers for Complexity */}
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#erosGreekPattern)" 
          transform="rotate(45 400 400) scale(0.7)"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};
