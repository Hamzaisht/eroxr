
import { motion } from "framer-motion";

export const ErosSymbols = () => {
  return (
    <>
      {/* Multiple Rotating Eros Symbols - Large Scale */}
      <motion.div
        className="absolute top-1/6 left-1/6 w-80 h-80 opacity-8"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <g transform="translate(100,100)">
            {/* Stylized Eros Bow */}
            <motion.path
              d="M-60,-20 Q0,-80 60,-20 Q0,40 -60,-20"
              fill="none"
              stroke="url(#bowGradient)"
              strokeWidth="3"
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {/* Arrow */}
            <motion.line
              x1="0" y1="-60"
              x2="0" y2="60"
              stroke="url(#arrowGradient)"
              strokeWidth="2"
              animate={{ 
                scaleY: [0.5, 1.2, 0.5],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            {/* Central Gem */}
            <motion.circle
              cx="0" cy="0" r="8"
              fill="url(#gemGradient)"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </g>
          <defs>
            <linearGradient id="bowGradient">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="arrowGradient">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <radialGradient id="gemGradient">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ec4899" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Counter-Rotating Eros Symbol - Right Side */}
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-60 h-60 opacity-6"
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 150 150" className="w-full h-full">
          <g transform="translate(75,75)">
            <motion.path
              d="M-40,-15 Q0,-55 40,-15 Q0,25 -40,-15"
              fill="none"
              stroke="url(#bow2Gradient)"
              strokeWidth="2.5"
              animate={{ 
                pathLength: [1, 0, 1],
                opacity: [0.4, 0.9, 0.4]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.circle
              cx="0" cy="0" r="6"
              fill="url(#gem2Gradient)"
              animate={{ 
                scale: [0.8, 1.3, 0.8],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </g>
          <defs>
            <linearGradient id="bow2Gradient">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <radialGradient id="gem2Gradient">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
    </>
  );
};
