
import { motion } from "framer-motion";

export const AmbientLightStreaks = () => {
  return (
    <>
      {/* Minimal light streaks */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`streak-${i}`}
          className="absolute opacity-3"
          style={{
            width: "2px",
            height: `${200 + i * 50}px`,
            background: `linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.2), transparent)`,
            left: `${20 + i * 20}%`,
            top: `${10 + i * 15}%`,
            transform: `rotate(${15 + i * 10}deg)`,
            filter: 'blur(1px)',
          }}
          animate={{
            opacity: [0.01, 0.06, 0.01],
            scaleY: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 3,
          }}
        />
      ))}
    </>
  );
};
