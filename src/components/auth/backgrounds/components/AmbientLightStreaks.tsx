
import { motion } from "framer-motion";

export const AmbientLightStreaks = () => {
  return (
    <>
      {/* Divine Light Beams - Representing divine blessing of love */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`divine-beam-${i}`}
          className="absolute opacity-6"
          style={{
            width: "3px",
            height: `${300 + i * 80}px`,
            background: `linear-gradient(to bottom, 
              transparent, 
              ${i % 4 === 0 ? 'rgba(251, 191, 36, 0.4)' : 
                i % 4 === 1 ? 'rgba(248, 113, 113, 0.4)' : 
                i % 4 === 2 ? 'rgba(167, 139, 250, 0.4)' : 'rgba(6, 182, 212, 0.4)'}, 
              transparent)`,
            left: `${10 + i * 11}%`,
            top: `${-10 + i * 3}%`,
            transform: `rotate(${10 + i * 20}deg)`,
            filter: 'blur(1px)',
            boxShadow: `0 0 20px ${
              i % 4 === 0 ? '#fbbf24' : 
              i % 4 === 1 ? '#f87171' : 
              i % 4 === 2 ? '#a78bfa' : '#06b6d4'
            }40`,
          }}
          animate={{
            opacity: [0.03, 0.2, 0.03],
            scaleY: [0.6, 1.4, 0.6],
            rotate: [10 + i * 20, 20 + i * 20, 10 + i * 20],
            filter: ['blur(2px)', 'blur(0.5px)', 'blur(2px)'],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.8,
          }}
        />
      ))}

      {/* Aurora of Passion - Northern lights effect */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`aurora-${i}`}
          className="absolute opacity-8"
          style={{
            width: `${200 + i * 100}px`,
            height: "80px",
            background: `linear-gradient(90deg, 
              transparent, 
              ${i % 2 === 0 ? 'rgba(236, 72, 153, 0.3)' : 'rgba(139, 92, 246, 0.3)'}, 
              transparent)`,
            left: `${20 + i * 20}%`,
            top: `${30 + i * 15}%`,
            borderRadius: '50px',
            filter: 'blur(15px)',
          }}
          animate={{
            x: [-50, 50, -50],
            opacity: [0.1, 0.4, 0.1],
            scaleX: [0.8, 1.3, 0.8],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 3,
          }}
        />
      ))}

      {/* Celestial Comet Trails - Love shooting stars */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`comet-${i}`}
          className="absolute opacity-15"
          style={{
            width: "2px",
            height: `${100 + i * 30}px`,
            background: `linear-gradient(45deg, 
              rgba(251, 191, 36, 0.8), 
              rgba(248, 113, 113, 0.6), 
              transparent)`,
            left: `${15 + i * 14}%`,
            top: `${10 + i * 12}%`,
            transform: `rotate(${45 + i * 15}deg)`,
            borderRadius: '2px',
            filter: 'blur(0.5px)',
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scaleY: [0, 1, 0],
            x: [0, 100, 200],
            y: [0, 50, 100],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 4,
          }}
        />
      ))}
    </>
  );
};
