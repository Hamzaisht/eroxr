
import { motion } from "framer-motion";

export const AmbientLightStreaks = () => {
  return (
    <>
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
    </>
  );
};
