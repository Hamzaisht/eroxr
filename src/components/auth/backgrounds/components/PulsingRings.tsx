
import { motion } from "framer-motion";

export const PulsingRings = () => {
  return (
    <>
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
    </>
  );
};
