
import { motion } from "framer-motion";

interface PatternSVGProps {
  scale: number;
  mousePosition: { x: number; y: number };
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export const PatternSVG = ({ scale, mousePosition, onMouseDown, onMouseUp, onMouseLeave }: PatternSVGProps) => {
  return (
    <motion.div
      className="absolute w-[500px] h-[500px] cursor-pointer"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      animate={{
        scale: scale,
        rotate: [0, 360],
        x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.03,
        y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.03,
      }}
      transition={{
        scale: { 
          type: "spring", 
          stiffness: 120, 
          damping: 25 
        },
        rotate: { 
          duration: 60, 
          repeat: Infinity, 
          ease: "linear" 
        },
        x: { 
          type: "spring", 
          stiffness: 80, 
          damping: 40 
        },
        y: { 
          type: "spring", 
          stiffness: 80, 
          damping: 40 
        }
      }}
      whileHover={{ 
        scale: 1.2,
        transition: { duration: 0.4 }
      }}
    >
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full opacity-40 hover:opacity-70 transition-all duration-700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Elegant RGB lightning gradient definitions */}
        <defs>
          <linearGradient id="lightningGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.8">
              <animate attributeName="stop-color" 
                values="#4ade80;#06b6d4;#8b5cf6;#f97316;#4ade80" 
                dur="6s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6">
              <animate attributeName="stop-color" 
                values="#06b6d4;#8b5cf6;#f97316;#4ade80;#06b6d4" 
                dur="6s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8">
              <animate attributeName="stop-color" 
                values="#8b5cf6;#f97316;#4ade80;#06b6d4;#8b5cf6" 
                dur="6s" 
                repeatCount="indefinite" />
            </stop>
          </linearGradient>
          
          <linearGradient id="lightningGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7">
              <animate attributeName="stop-color" 
                values="#06b6d4;#f97316;#4ade80;#8b5cf6;#06b6d4" 
                dur="5s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.7">
              <animate attributeName="stop-color" 
                values="#f97316;#4ade80;#8b5cf6;#06b6d4;#f97316" 
                dur="5s" 
                repeatCount="indefinite" />
            </stop>
          </linearGradient>

          <filter id="elegantGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer circle with elegant flowing colors */}
        <circle
          cx="250"
          cy="250"
          r="230"
          stroke="url(#lightningGradient1)"
          strokeWidth="1.5"
          fill="none"
          filter="url(#elegantGlow)"
        />
        
        {/* Inner circle */}
        <circle
          cx="250"
          cy="250"
          r="180"
          stroke="url(#lightningGradient2)"
          strokeWidth="1"
          fill="none"
          filter="url(#elegantGlow)"
        />
        
        {/* Greek meander pattern - outer ring with flowing RGB */}
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i * 18) * (Math.PI / 180);
          const x = 250 + Math.cos(angle) * 200;
          const y = 250 + Math.sin(angle) * 200;
          const rotation = i * 18;
          
          return (
            <g key={`outer-${i}`} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
              <path
                d="M-18,-18 L18,-18 L18,18 L-7,18 L-7,-7 L7,-7"
                stroke="url(#lightningGradient1)"
                strokeWidth="1.5"
                fill="none"
                filter="url(#elegantGlow)"
                opacity="0.9"
              />
            </g>
          );
        })}
        
        {/* Greek meander pattern - inner ring */}
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i * 25.7) * (Math.PI / 180);
          const x = 250 + Math.cos(angle) * 150;
          const y = 250 + Math.sin(angle) * 150;
          const rotation = i * 25.7;
          
          return (
            <g key={`inner-${i}`} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
              <path
                d="M-13,-13 L13,-13 L13,13 L-5,13 L-5,-5 L5,-5"
                stroke="url(#lightningGradient2)"
                strokeWidth="1"
                fill="none"
                filter="url(#elegantGlow)"
                opacity="0.7"
              />
            </g>
          );
        })}
        
        {/* Center ornament - elaborate Greek pattern with flowing colors */}
        <g transform="translate(250, 250)">
          <path
            d="M-25,-25 L25,-25 L25,25 L-10,25 L-10,-10 L10,-10 L10,10 L-25,10 Z"
            stroke="url(#lightningGradient1)"
            strokeWidth="2"
            fill="rgba(255, 255, 255, 0.02)"
            filter="url(#elegantGlow)"
            opacity="0.95"
          />
          {/* Inner cross pattern */}
          <path
            d="M-17,-17 L17,-17 L17,17 L-7,17 L-7,-7 L7,-7 L7,7 L-17,7 Z"
            stroke="url(#lightningGradient2)"
            strokeWidth="1"
            fill="none"
            filter="url(#elegantGlow)"
            opacity="0.8"
          />
        </g>
      </svg>
    </motion.div>
  );
};
