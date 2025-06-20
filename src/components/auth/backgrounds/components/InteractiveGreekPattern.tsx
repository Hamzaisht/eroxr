
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
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      {/* Multiple pattern instances to fill the entire background */}
      {Array.from({ length: 9 }).map((_, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const xOffset = (col - 1) * 100; // -100, 0, 100
        const yOffset = (row - 1) * 100; // -100, 0, 100
        
        return (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] cursor-pointer"
            style={{
              transform: `translate(-50%, -50%) translate(${xOffset}%, ${yOffset}%)`,
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            animate={{
              scale: index === 4 ? scale : 1, // Only center pattern scales
              rotate: [0, 360],
            }}
            transition={{
              scale: { 
                type: "spring", 
                stiffness: 100, 
                damping: 20 
              },
              rotate: { 
                duration: 60 + index * 5, // Varying rotation speeds
                repeat: Infinity, 
                ease: "linear" 
              }
            }}
            whileHover={index === 4 ? { scale: 1.1 } : {}}
          >
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full opacity-10 hover:opacity-20 transition-opacity duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer circle */}
              <circle
                cx="200"
                cy="200"
                r="180"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
              />
              
              {/* Inner circle */}
              <circle
                cx="200"
                cy="200"
                r="140"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1"
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
                      stroke="rgba(255, 255, 255, 0.25)"
                      strokeWidth="1.5"
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
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="1"
                      fill="none"
                    />
                  </g>
                );
              })}
              
              {/* Center ornament - more elaborate Greek pattern */}
              <g transform="translate(200, 200)">
                <path
                  d="M-20,-20 L20,-20 L20,20 L-8,20 L-8,-8 L8,-8 L8,8 L-20,8 Z"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1.5"
                  fill="rgba(255, 255, 255, 0.02)"
                />
                {/* Inner cross pattern */}
                <path
                  d="M-12,-12 L12,-12 L12,12 L-4,12 L-4,-4 L4,-4 L4,4 L-12,4 Z"
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth="1"
                  fill="none"
                />
              </g>
            </svg>
          </motion.div>
        );
      })}
      
      {/* Glow effect when pressed - only on center pattern */}
      {isPressed && (
        <motion.div
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            transform: 'translate(-50%, -50%)',
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.8, 1.5, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
};
