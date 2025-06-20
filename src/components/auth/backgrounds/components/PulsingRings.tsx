
import { motion } from "framer-motion";

export const PulsingRings = () => {
  return (
    <>
      {/* Minimal pulsing rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-4"
          style={{
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            borderColor: "#3b82f6",
            borderWidth: "1px",
            filter: `blur(${i * 0.5}px)`,
          }}
          animate={{
            scale: [0.9, 1.1, 0.9],
            opacity: [0.02, 0.06, 0.02],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
    </>
  );
};
