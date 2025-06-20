
import { motion } from "framer-motion";

export const FloatingGeometrics = () => {
  return (
    <>
      {/* Minimal geometric shapes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`geo-${i}`}
          className="absolute opacity-8"
          style={{
            left: `${15 + (i * 15) % 70}%`,
            top: `${20 + (i * 20) % 60}%`,
            width: `${20 + (i % 2) * 10}px`,
            height: `${20 + (i % 2) * 10}px`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.03, 0.12, 0.03],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        >
          <div 
            className="w-full h-full border border-blue-400/20 rounded-sm"
            style={{ transform: `rotate(${i % 2 === 0 ? '45deg' : '0deg'})` }}
          />
        </motion.div>
      ))}
    </>
  );
};
