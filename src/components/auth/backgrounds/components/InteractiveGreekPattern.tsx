
import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";

export const InteractiveGreekPattern = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);
  const [holdDuration, setHoldDuration] = useState(0);

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

  // Calculate scale based on hold duration (max 2x scale after 2 seconds)
  const scale = isPressed 
    ? Math.min(1 + (holdDuration / 2000), 2) 
    : 1;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="relative w-[600px] h-[600px] cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        animate={{
          scale,
          rotate: [0, 360],
        }}
        transition={{
          scale: { 
            type: "spring", 
            stiffness: 100, 
            damping: 20 
          },
          rotate: { 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }
        }}
        whileHover={{ scale: 1.1 }}
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full opacity-20 hover:opacity-30 transition-opacity duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle */}
          <circle
            cx="200"
            cy="200"
            r="180"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
          />
          
          {/* Inner circle */}
          <circle
            cx="200"
            cy="200"
            r="140"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
          />
          
          {/* Greek meander pattern - outer ring */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 22.5) * (Math.PI / 180);
            const x = 200 + Math.cos(angle) * 160;
            const y = 200 + Math.sin(angle) * 160;
            const rotation = i * 22.5;
            
            return (
              <g key={`outer-${i}`} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
                <path
                  d="M-15,-15 L15,-15 L15,15 L-5,15 L-5,-5 L5,-5"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="2"
                  fill="none"
                />
              </g>
            );
          })}
          
          {/* Greek meander pattern - inner ring */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const x = 200 + Math.cos(angle) * 120;
            const y = 200 + Math.sin(angle) * 120;
            const rotation = i * 30;
            
            return (
              <g key={`inner-${i}`} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
                <path
                  d="M-10,-10 L10,-10 L10,10 L-3,10 L-3,-3 L3,-3"
                  stroke="rgba(255, 255, 255, 0.35)"
                  strokeWidth="1.5"
                  fill="none"
                />
              </g>
            );
          })}
          
          {/* Center ornament - more elaborate Greek pattern */}
          <g transform="translate(200, 200)">
            <path
              d="M-20,-20 L20,-20 L20,20 L-8,20 L-8,-8 L8,-8 L8,8 L-20,8 Z"
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth="2"
              fill="rgba(255, 255, 255, 0.05)"
            />
            {/* Inner cross pattern */}
            <path
              d="M-12,-12 L12,-12 L12,12 L-4,12 L-4,-4 L4,-4 L4,4 L-12,4 Z"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.5"
              fill="none"
            />
          </g>
        </svg>
        
        {/* Glow effect when pressed */}
        {isPressed && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
