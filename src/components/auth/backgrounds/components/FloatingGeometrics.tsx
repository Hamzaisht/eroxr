
import { motion } from "framer-motion";

export const FloatingGeometrics = () => {
  return (
    <>
      {/* Sacred geometric shapes representing different mythologies */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`geo-${i}`}
          className="absolute opacity-6"
          style={{
            left: `${10 + (i * 12) % 80}%`,
            top: `${15 + (i * 15) % 70}%`,
            width: `${16 + (i % 3) * 8}px`,
            height: `${16 + (i % 3) * 8}px`,
          }}
          animate={{
            rotate: [0, i % 2 === 0 ? 360 : -360],
            scale: [0.7, 1.3, 0.7],
            opacity: [0.02, 0.15, 0.02],
          }}
          transition={{
            duration: 20 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        >
          {/* Different shapes for different mythologies */}
          {i % 4 === 0 ? (
            // Greek - Diamond
            <div 
              className="w-full h-full border border-purple-400/20 transform rotate-45"
              style={{ borderRadius: '2px' }}
            />
          ) : i % 4 === 1 ? (
            // Egyptian - Triangle
            <div 
              className="w-full h-full"
              style={{
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: '14px solid rgba(245, 158, 11, 0.2)',
              }}
            />
          ) : i % 4 === 2 ? (
            // Japanese - Circle
            <div className="w-full h-full rounded-full border border-cyan-400/15" />
          ) : (
            // Connection - Hexagon
            <div 
              className="w-full h-full border border-pink-400/15"
              style={{ 
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                backgroundColor: 'rgba(244, 114, 182, 0.05)'
              }}
            />
          )}
        </motion.div>
      ))}
    </>
  );
};
