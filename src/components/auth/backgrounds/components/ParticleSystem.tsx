
import { motion } from "framer-motion";

export const ParticleSystem = () => {
  return (
    <>
      {/* Stardust of Desire - Cosmic love particles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={`stardust-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              i % 4 === 0 ? '#fbbf24' : 
              i % 4 === 1 ? '#f87171' : 
              i % 4 === 2 ? '#a78bfa' : '#06b6d4'
            }, transparent)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: `0 0 ${2 + Math.random() * 4}px currentColor`,
          }}
          animate={{
            y: [0, -150 - Math.random() * 100, 0],
            x: [0, Math.sin(i * 0.5) * 80, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5 + Math.random(), 0],
            rotate: [0, 180 + Math.random() * 180, 360],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Sparks of Passion - Fiery love sparks */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`passion-spark-${i}`}
          className="absolute w-0.5 h-6 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${
              i % 3 === 0 ? '#f59e0b' : i % 3 === 1 ? '#dc2626' : '#ec4899'
            }, transparent)`,
            left: `${15 + Math.random() * 70}%`,
            top: `${20 + Math.random() * 60}%`,
            filter: 'blur(0.5px)',
          }}
          animate={{
            scaleY: [0, 1, 0],
            opacity: [0, 0.8, 0],
            rotate: [0, Math.random() * 360],
            y: [0, -40 - Math.random() * 30, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Love Hearts - Floating romantic symbols */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`love-heart-${i}`}
          className="absolute opacity-20"
          style={{
            left: `${10 + i * 11}%`,
            top: `${20 + (i % 3) * 25}%`,
            fontSize: `${12 + Math.random() * 8}px`,
          }}
          animate={{
            y: [0, -80 - Math.random() * 40, 0],
            rotate: [0, 15, -15, 0],
            scale: [0.5, 1.2, 0.5],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
              fill={`url(#heartGradient${i})`}
            />
            <defs>
              <linearGradient id={`heartGradient${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </>
  );
};
