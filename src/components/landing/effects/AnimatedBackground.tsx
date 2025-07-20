import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedBackground = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating Neural Nodes */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${10 + (i * 8)}%`,
            top: `${20 + Math.sin(i) * 30}%`,
            background: `hsl(${271 + i * 15}, 100%, ${60 + Math.sin(i) * 20}%)`,
            filter: 'blur(1px)',
            boxShadow: `0 0 ${20 + i * 2}px hsl(${271 + i * 15}, 100%, ${60 + Math.sin(i) * 20}%)`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.sin(i) * 20, 0],
            scale: [0.8, 1.4, 0.8],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 8 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Connecting Lines */}
      <svg 
        width={dimensions.width} 
        height={dimensions.height}
        className="absolute inset-0 opacity-30"
      >
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={`line-${i}`}
            x1={`${10 + i * 12}%`}
            y1={`${30 + Math.sin(i) * 20}%`}
            x2={`${20 + i * 12}%`}
            y2={`${50 + Math.cos(i) * 30}%`}
            stroke={`hsl(${271 + i * 20}, 100%, ${50 + i * 5}%)`}
            strokeWidth="1"
            strokeDasharray="4 8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Ambient Light Orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full opacity-20"
          style={{
            left: `${15 + i * 15}%`,
            top: `${25 + Math.sin(i * 0.5) * 50}%`,
            width: 150 + Math.sin(i) * 50,
            height: 150 + Math.sin(i) * 50,
            background: `radial-gradient(circle, hsl(${271 + i * 25}, 100%, ${60 + i * 5}%) 0%, transparent 60%)`,
            filter: 'blur(30px)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [0, Math.sin(i) * 50, 0],
            y: [0, Math.cos(i) * 30, 0],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};