
import { motion } from "framer-motion";

export const PulsingRings = () => {
  return (
    <>
      {/* Sacred geometry rings - representing connection and unity */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`sacred-ring-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-6"
          style={{
            width: `${180 + i * 120}px`,
            height: `${180 + i * 120}px`,
            borderColor: i % 2 === 0 ? 
              (i === 0 ? '#f59e0b' : '#8b5cf6') : 
              (i === 1 ? '#f472b6' : '#06b6d4'),
            borderWidth: "1px",
            filter: `blur(${i * 1}px)`,
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.03, 0.12, 0.03],
            rotate: [0, i % 2 === 0 ? 360 : -360],
          }}
          transition={{
            duration: 25 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 3,
          }}
        />
      ))}

      {/* Inner divine essence - pulsing core */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-8"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(245, 158, 11, 0.05) 50%, transparent 100%)',
          filter: 'blur(20px)',
        }}
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
};
