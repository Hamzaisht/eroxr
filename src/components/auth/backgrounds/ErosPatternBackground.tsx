
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const ErosPatternBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Greek key pattern SVG path
  const greekKeyPattern = "M0,0 L8,0 L8,8 L16,8 L16,16 L8,16 L8,24 L0,24 L0,16 L-8,16 L-8,8 L0,8 Z";

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Dynamic background glow following mouse */}
      <motion.div
        className="absolute -inset-6 bg-gradient-to-r from-pink-500/10 via-purple-500/15 to-cyan-500/10 rounded-3xl blur-3xl opacity-60"
        animate={{
          x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.015,
          y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.015,
          rotate: [0, 0.5, -0.5, 0],
        }}
        transition={{ 
          x: { type: "spring", stiffness: 50, damping: 30 },
          y: { type: "spring", stiffness: 50, damping: 30 },
          rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Animated Greek pattern overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full opacity-5"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="greekPattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <motion.path
                d={greekKeyPattern}
                stroke="url(#greekGradient)"
                strokeWidth="1.5"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              />
            </pattern>
            <linearGradient id="greekGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#greekPattern)" />
        </svg>
      </div>

      {/* Rotating Eros-inspired circular patterns */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#erosGradient1)"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="url(#erosGradient1)"
            strokeWidth="0.5"
            strokeDasharray="3,3"
          />
          <defs>
            <linearGradient id="erosGradient1">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-24 h-24 opacity-8"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="url(#erosGradient2)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          <defs>
            <linearGradient id="erosGradient2">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Central Eros symbol pattern */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 opacity-5"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Stylized Eros bow pattern */}
          <path
            d="M20,50 Q50,20 80,50 Q50,80 20,50"
            fill="none"
            stroke="url(#erosCenterGradient)"
            strokeWidth="2"
          />
          <circle cx="50" cy="50" r="3" fill="url(#erosCenterGradient)" />
          <defs>
            <radialGradient id="erosCenterGradient">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Additional floating geometric elements */}
      <motion.div
        className="absolute top-1/6 right-1/3 w-12 h-12 opacity-8"
        animate={{ 
          rotate: [0, 180, 360],
          x: [0, 20, 0],
          y: [0, -15, 0]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,10 80,40 50,90 20,40"
            fill="none"
            stroke="url(#geometricGradient)"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="geometricGradient">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-1/6 left-1/3 w-10 h-10 opacity-6"
        animate={{ 
          rotate: [360, 180, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect
            x="25" y="25" width="50" height="50"
            fill="none"
            stroke="url(#squareGradient)"
            strokeWidth="1"
            transform="rotate(45 50 50)"
          />
          <defs>
            <linearGradient id="squareGradient">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};
