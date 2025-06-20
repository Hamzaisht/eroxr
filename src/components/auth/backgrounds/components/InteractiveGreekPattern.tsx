
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

  // Calculate scale based on hold duration (max 3x scale after 2 seconds)
  const scale = isPressed 
    ? Math.min(1 + (holdDuration / 1000), 3) 
    : 1;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto overflow-hidden">
      {/* Main central pattern that circles around the login container */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] cursor-pointer"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        animate={{
          scale: scale,
          rotate: [0, 360],
          x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.05,
          y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.05,
        }}
        transition={{
          scale: { 
            type: "spring", 
            stiffness: 150, 
            damping: 25 
          },
          rotate: { 
            duration: 80, 
            repeat: Infinity, 
            ease: "linear" 
          },
          x: { 
            type: "spring", 
            stiffness: 100, 
            damping: 50 
          },
          y: { 
            type: "spring", 
            stiffness: 100, 
            damping: 50 
          }
        }}
        whileHover={{ 
          scale: 1.3,
          transition: { duration: 0.3 }
        }}
      >
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full opacity-30 hover:opacity-60 transition-all duration-500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Animated gradient definitions */}
          <defs>
            <linearGradient id="rgbGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff0080" stopOpacity="0.8">
                <animate attributeName="stop-color" 
                  values="#ff0080;#00ff80;#8000ff;#ff8000;#ff0080" 
                  dur="4s" 
                  repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#00ff80" stopOpacity="0.6">
                <animate attributeName="stop-color" 
                  values="#00ff80;#8000ff;#ff8000;#ff0080;#00ff80" 
                  dur="4s" 
                  repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#8000ff" stopOpacity="0.8">
                <animate attributeName="stop-color" 
                  values="#8000ff;#ff8000;#ff0080;#00ff80;#8000ff" 
                  dur="4s" 
                  repeatCount="indefinite" />
              </stop>
            </linearGradient>
            
            <linearGradient id="rgbGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.7">
                <animate attributeName="stop-color" 
                  values="#00d4ff;#ff4080;#80ff40;#ff8040;#00d4ff" 
                  dur="3s" 
                  repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#ff4080" stopOpacity="0.7">
                <animate attributeName="stop-color" 
                  values="#ff4080;#80ff40;#ff8040;#00d4ff;#ff4080" 
                  dur="3s" 
                  repeatCount="indefinite" />
              </stop>
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Outer circle with animated stroke */}
          <circle
            cx="300"
            cy="300"
            r="280"
            stroke="url(#rgbGradient1)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          />
          
          {/* Inner circle */}
          <circle
            cx="300"
            cy="300"
            r="220"
            stroke="url(#rgbGradient2)"
            strokeWidth="1.5"
            fill="none"
            filter="url(#glow)"
          />
          
          {/* Greek meander pattern - outer ring with RGB colors */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15) * (Math.PI / 180);
            const x = 300 + Math.cos(angle) * 250;
            const y = 300 + Math.sin(angle) * 250;
            const rotation = i * 15;
            
            return (
              <g key={`outer-${i}`} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
                <path
                  d="M-20,-20 L20,-20 L20,20 L-8,20 L-8,-8 L8,-8"
                  stroke="url(#rgbGradient1)"
                  strokeWidth="2"
                  fill="none"
                  filter="url(#glow)"
                  opacity="0.8"
                />
              </g>
            );
          })}
          
          {/* Greek meander pattern - inner ring */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 22.5) * (Math.PI / 180);
            const x = 300 + Math.cos(angle) * 190;
            const y = 300 + Math.sin(angle) * 190;
            const rotation = i * 22.5;
            
            return (
              <g key={`inner-${i}`} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
                <path
                  d="M-15,-15 L15,-15 L15,15 L-6,15 L-6,-6 L6,-6"
                  stroke="url(#rgbGradient2)"
                  strokeWidth="1.5"
                  fill="none"
                  filter="url(#glow)"
                  opacity="0.6"
                />
              </g>
            );
          })}
          
          {/* Center ornament - elaborate Greek pattern with RGB */}
          <g transform="translate(300, 300)">
            <path
              d="M-30,-30 L30,-30 L30,30 L-12,30 L-12,-12 L12,-12 L12,12 L-30,12 Z"
              stroke="url(#rgbGradient1)"
              strokeWidth="2.5"
              fill="rgba(255, 255, 255, 0.03)"
              filter="url(#glow)"
              opacity="0.9"
            />
            {/* Inner cross pattern */}
            <path
              d="M-20,-20 L20,-20 L20,20 L-8,20 L-8,-8 L8,-8 L8,8 L-20,8 Z"
              stroke="url(#rgbGradient2)"
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              opacity="0.7"
            />
          </g>
        </svg>
      </motion.div>

      {/* Secondary larger pattern for depth - 2x size */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[1200px] h-[1200px] pointer-events-none"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          rotate: [360, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          rotate: { 
            duration: 120, 
            repeat: Infinity, 
            ease: "linear" 
          },
          opacity: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <svg
          viewBox="0 0 1200 1200"
          className="w-full h-full opacity-15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff00ff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#00ffff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffff00" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          <circle
            cx="600"
            cy="600"
            r="580"
            stroke="url(#bgGradient)"
            strokeWidth="1"
            fill="none"
          />
          
          {Array.from({ length: 32 }).map((_, i) => {
            const angle = (i * 11.25) * (Math.PI / 180);
            const x = 600 + Math.cos(angle) * 520;
            const y = 600 + Math.sin(angle) * 520;
            const rotation = i * 11.25;
            
            return (
              <g key={`bg-${i}`} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
                <path
                  d="M-25,-25 L25,-25 L25,25 L-10,25 L-10,-10 L10,-10"
                  stroke="url(#bgGradient)"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.4"
                />
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Pulsing glow effect when pressed */}
      {isPressed && (
        <motion.div
          className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{
            transform: 'translate(-50%, -50%)',
            background: "radial-gradient(circle, rgba(255, 0, 128, 0.15) 0%, rgba(0, 255, 128, 0.1) 50%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.8, 2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
};
