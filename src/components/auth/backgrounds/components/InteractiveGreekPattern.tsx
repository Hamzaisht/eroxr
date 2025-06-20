
import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";

export const InteractiveGreekPattern = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);
  const [holdDuration, setHoldDuration] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsPressed(true);
    setPressStartTime(Date.now());
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
    setPressStartTime(null);
    setHoldDuration(0);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPressed(false);
    setPressStartTime(null);
    setHoldDuration(0);
  }, []);

  // Update hold duration while pressed
  useEffect(() => {
    if (isPressed && pressStartTime) {
      const interval = setInterval(() => {
        setHoldDuration(Date.now() - pressStartTime);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPressed, pressStartTime]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Calculate scale based on hold duration (max 2.5x scale after 2 seconds)
  const scale = isPressed 
    ? Math.min(1 + (holdDuration / 1500), 2.5) 
    : 1;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto overflow-hidden flex items-center justify-center">
      {/* Main central pattern that circles around the login container */}
      <motion.div
        className="absolute w-[500px] h-[500px] cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
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

      {/* Larger background pattern for depth - 2x size with subtler animation */}
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

      {/* Elegant glow effect when pressed */}
      {isPressed && (
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(75, 222, 128, 0.1) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 70%)",
            filter: "blur(30px)",
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.9, 1.8, 0.9],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
};
