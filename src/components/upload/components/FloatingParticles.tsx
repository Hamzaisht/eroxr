
import { motion, AnimatePresence } from 'framer-motion';

export const FloatingParticles = () => {
  return (
    <AnimatePresence>
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: `linear-gradient(45deg, ${
              i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#8b5cf6' : '#ec4899'
            }, transparent)`,
            left: `${25 + i * 20}%`,
            top: `${20 + (i % 2) * 60}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + i * 0.2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </AnimatePresence>
  );
};
