
import { motion } from "framer-motion";

export const BackgroundPattern = () => {
  return (
    <motion.div
      className="absolute w-[1000px] h-[1000px] pointer-events-none"
      animate={{
        rotate: [360, 0],
        opacity: [0.08, 0.15, 0.08],
      }}
      transition={{
        rotate: { 
          duration: 100, 
          repeat: Infinity, 
          ease: "linear" 
        },
        opacity: {
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      <svg
        viewBox="0 0 1000 1000"
        className="w-full h-full opacity-20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bgLightning" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        <circle
          cx="500"
          cy="500"
          r="480"
          stroke="url(#bgLightning)"
          strokeWidth="0.8"
          fill="none"
        />
        
        {Array.from({ length: 28 }).map((_, i) => {
          const angle = (i * 12.86) * (Math.PI / 180);
          const x = 500 + Math.cos(angle) * 420;
          const y = 500 + Math.sin(angle) * 420;
          const rotation = i * 12.86;
          
          return (
            <g key={`bg-${i}`} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
              <path
                d="M-20,-20 L20,-20 L20,20 L-8,20 L-8,-8 L8,-8"
                stroke="url(#bgLightning)"
                strokeWidth="0.8"
                fill="none"
                opacity="0.5"
              />
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
};
