
import { motion } from "framer-motion";

export const AmbientLightStreaks = () => {
  return (
    <>
      {/* Divine light beams - crossing the screen */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`light-beam-${i}`}
          className="absolute opacity-4"
          style={{
            width: "3px",
            height: `${300 + i * 100}px`,
            background: `linear-gradient(to bottom, 
              transparent, 
              ${i === 0 ? 'rgba(245, 158, 11, 0.15)' : 
                i === 1 ? 'rgba(244, 114, 182, 0.12)' : 
                'rgba(6, 182, 212, 0.1)'}, 
              transparent)`,
            left: `${25 + i * 25}%`,
            top: `${5 + i * 10}%`,
            transform: `rotate(${20 + i * 15}deg)`,
            filter: 'blur(2px)',
          }}
          animate={{
            opacity: [0.02, 0.15, 0.02],
            scaleY: [0.6, 1.4, 0.6],
            scaleX: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 20 + i * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 5,
          }}
        />
      ))}

      {/* Sacred connection lines */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`connection-line-${i}`}
          className="absolute opacity-3"
          style={{
            width: `${200 + i * 150}px`,
            height: "1px",
            background: `linear-gradient(to right, 
              transparent, 
              ${i === 0 ? 'rgba(168, 85, 247, 0.2)' : 'rgba(245, 158, 11, 0.15)'}, 
              transparent)`,
            left: `${10 + i * 20}%`,
            top: `${40 + i * 30}%`,
            transform: `rotate(${i === 0 ? '-15deg' : '15deg'})`,
            filter: 'blur(1px)',
          }}
          animate={{
            opacity: [0.05, 0.25, 0.05],
            scaleX: [0.7, 1.3, 0.7],
          }}
          transition={{
            duration: 16 + i * 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 4,
          }}
        />
      ))}
    </>
  );
};
