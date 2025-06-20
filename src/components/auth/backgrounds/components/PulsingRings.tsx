
import { motion } from "framer-motion";

export const PulsingRings = () => {
  return (
    <>
      {/* Ripples of Love - Expanding circles of emotion */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`love-ripple-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-8"
          style={{
            width: `${250 + i * 120}px`,
            height: `${250 + i * 120}px`,
            borderColor: i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#f87171" : "#a78bfa",
            borderWidth: "2px",
            filter: `blur(${i * 0.5}px)`,
            boxShadow: `0 0 ${20 + i * 10}px ${
              i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#f87171' : '#a78bfa'
            }30`,
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.03, 0.15, 0.03],
            rotate: [0, 180, 360],
            borderWidth: ["1px", "3px", "1px"],
          }}
          transition={{
            duration: 25 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 3,
          }}
        />
      ))}

      {/* Passion Rings - Fiery circles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`passion-ring-${i}`}
          className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-12"
          style={{
            width: `${150 + i * 80}px`,
            height: `${150 + i * 80}px`,
            border: `2px solid ${i % 2 === 0 ? '#dc2626' : '#ec4899'}`,
            filter: 'blur(1px)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.25, 0.05],
            rotate: [0, -360],
          }}
          transition={{
            duration: 20 + i * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2.5,
          }}
        />
      ))}
    </>
  );
};
