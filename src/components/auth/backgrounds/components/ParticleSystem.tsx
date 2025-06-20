
import { motion } from "framer-motion";

export const ParticleSystem = () => {
  return (
    <>
      {/* Golden wealth particles - Egyptian inspired */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`gold-particle-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-400/20 to-amber-500/15"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${20 + Math.random() * 60}%`,
            filter: 'blur(0.5px)',
          }}
          animate={{
            y: [0, -120, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1.5, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Rose love particles - Greek inspired */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`rose-particle-${i}`}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-pink-400/15 to-rose-500/20"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${10 + Math.random() * 80}%`,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i) * 20, 0],
            opacity: [0, 0.4, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: 18 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Zen freedom particles - Japanese inspired */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`zen-particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/15"
          style={{
            left: `${25 + Math.random() * 50}%`,
            top: `${30 + Math.random() * 40}%`,
            filter: 'blur(0.8px)',
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.cos(i) * 30, 0],
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
            rotate: [0, 360, 720],
          }}
          transition={{
            duration: 20 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};
