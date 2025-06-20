
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

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Layered Background Gradients for Depth */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-purple-900/30 to-cyan-900/20"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 0.5, 0],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />

      {/* Dynamic Mouse-Following Mega Glow */}
      <motion.div
        className="absolute w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(139,92,246,0.3) 30%, rgba(6,182,212,0.2) 60%, transparent 100%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.1,
          y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.1,
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          x: { type: "spring", stiffness: 20, damping: 30 },
          y: { type: "spring", stiffness: 20, damping: 30 },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Animated Greek Pattern Network */}
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

      {/* Floating Geometric Elements with Complex Paths */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute opacity-20"
          style={{
            left: `${20 + (i * 7) % 80}%`,
            top: `${15 + (i * 11) % 70}%`,
            width: `${20 + (i % 3) * 10}px`,
            height: `${20 + (i % 3) * 10}px`,
          }}
          animate={{
            rotate: [0, 360],
            x: [0, Math.sin(i) * 50, 0],
            y: [0, Math.cos(i) * 30, 0],
            scale: [1, 1.2 + (i % 2) * 0.3, 1],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          <svg viewBox="0 0 40 40" className="w-full h-full">
            {i % 4 === 0 && (
              <polygon
                points="20,5 35,15 35,25 20,35 5,25 5,15"
                fill="none"
                stroke={`url(#grad${i % 3})`}
                strokeWidth="1.5"
              />
            )}
            {i % 4 === 1 && (
              <circle
                cx="20" cy="20" r="15"
                fill="none"
                stroke={`url(#grad${i % 3})`}
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            )}
            {i % 4 === 2 && (
              <rect
                x="8" y="8" width="24" height="24"
                fill="none"
                stroke={`url(#grad${i % 3})`}
                strokeWidth="1"
                transform="rotate(45 20 20)"
              />
            )}
            {i % 4 === 3 && (
              <path
                d="M20,10 L25,20 L20,30 L15,20 Z"
                fill="none"
                stroke={`url(#grad${i % 3})`}
                strokeWidth="1.5"
              />
            )}
            <defs>
              <linearGradient id={`grad${i % 3}`}>
                <stop offset="0%" stopColor={i % 3 === 0 ? "#ec4899" : i % 3 === 1 ? "#8b5cf6" : "#06b6d4"} />
                <stop offset="100%" stopColor={i % 3 === 0 ? "#8b5cf6" : i % 3 === 1 ? "#06b6d4" : "#ec4899"} />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}

      {/* Pulsing Energy Rings */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-10"
          style={{
            width: `${300 + i * 100}px`,
            height: `${300 + i * 100}px`,
            borderColor: i % 2 === 0 ? "#ec4899" : "#8b5cf6",
            borderWidth: "1px",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.2, 0.05],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}

      {/* Particle System Enhancement */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: `linear-gradient(45deg, ${
              i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4'
            }, transparent)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i) * 50, 0],
            opacity: [0, 1, 0],
            scale: [0, 2, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Ambient Light Streaks */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`streak-${i}`}
          className="absolute opacity-5"
          style={{
            width: "2px",
            height: `${200 + i * 50}px`,
            background: `linear-gradient(to bottom, transparent, ${
              i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4'
            }, transparent)`,
            left: `${20 + i * 15}%`,
            top: `${10 + i * 5}%`,
            transform: `rotate(${15 + i * 30}deg)`,
          }}
          animate={{
            opacity: [0.02, 0.15, 0.02],
            scaleY: [0.5, 1.2, 0.5],
            rotate: [15 + i * 30, 25 + i * 30, 15 + i * 30],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
};
