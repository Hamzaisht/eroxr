import { motion } from "framer-motion";
import { useMemo } from "react";

export const AnimatedBackground = () => {
  // Pre-calculate positions for better performance
  const nodePositions = useMemo(() => 
    [...Array(8)].map((_, i) => ({
      left: `${15 + (i * 10)}%`,
      top: `${25 + Math.sin(i) * 25}%`,
      hue: 271 + i * 20,
      delay: i * 0.4,
    })), []
  );

  const orbPositions = useMemo(() => 
    [...Array(4)].map((_, i) => ({
      left: `${20 + i * 20}%`,
      top: `${30 + Math.sin(i * 0.5) * 40}%`,
      size: 120 + Math.sin(i) * 30,
      hue: 271 + i * 30,
      delay: i * 2,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-60">
      {/* Optimized Neural Nodes */}
      {nodePositions.map((node, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            left: node.left,
            top: node.top,
            background: `hsl(${node.hue}, 80%, 65%)`,
            filter: 'blur(0.5px)',
            boxShadow: `0 0 15px hsl(${node.hue}, 80%, 65%)`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: node.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Simplified Ambient Orbs */}
      {orbPositions.map((orb, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full opacity-15"
          style={{
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, hsl(${orb.hue}, 90%, 65%) 0%, transparent 50%)`,
            filter: 'blur(25px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};