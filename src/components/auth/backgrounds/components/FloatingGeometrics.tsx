
import { motion } from "framer-motion";

export const FloatingGeometrics = () => {
  return (
    <>
      {/* Sacred Geometry of Love - Meaningful shapes */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`sacred-geometry-${i}`}
          className="absolute opacity-15"
          style={{
            left: `${15 + (i * 8) % 70}%`,
            top: `${20 + (i * 12) % 60}%`,
            width: `${25 + (i % 3) * 15}px`,
            height: `${25 + (i % 3) * 15}px`,
          }}
          animate={{
            rotate: [0, 360],
            x: [0, Math.sin(i * 0.7) * 60, 0],
            y: [0, Math.cos(i * 0.7) * 40, 0],
            scale: [0.8, 1.4 + (i % 2) * 0.3, 0.8],
            opacity: [0.08, 0.25, 0.08],
          }}
          transition={{
            duration: 18 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        >
          <svg viewBox="0 0 50 50" className="w-full h-full">
            {/* Venus Symbol - Love goddess */}
            {i % 5 === 0 && (
              <g>
                <circle cx="25" cy="18" r="8" fill="none" stroke={`url(#venusGrad${i})`} strokeWidth="2" />
                <line x1="25" y1="26" x2="25" y2="38" stroke={`url(#venusGrad${i})`} strokeWidth="2" />
                <line x1="20" y1="33" x2="30" y2="33" stroke={`url(#venusGrad${i})`} strokeWidth="2" />
              </g>
            )}
            
            {/* Infinity Symbol - Eternal love */}
            {i % 5 === 1 && (
              <path
                d="M15,25 Q10,15 20,15 Q30,15 25,25 Q30,35 20,35 Q10,35 15,25 M25,25 Q30,15 40,15 Q50,15 45,25 Q50,35 40,35 Q30,35 25,25"
                fill="none"
                stroke={`url(#infinityGrad${i})`}
                strokeWidth="2"
              />
            )}
            
            {/* Heart Mandala */}
            {i % 5 === 2 && (
              <g>
                <path
                  d="M25,35 C25,35 15,25 15,18 C15,14 18,11 22,11 C23.5,11 24.5,12 25,13 C25.5,12 26.5,11 28,11 C32,11 35,14 35,18 C35,25 25,35 25,35"
                  fill={`url(#heartMandalaGrad${i})`}
                  opacity="0.7"
                />
                <circle cx="25" cy="25" r="20" fill="none" stroke={`url(#heartMandalaGrad${i})`} strokeWidth="1" opacity="0.3" />
              </g>
            )}
            
            {/* Sacred Triangle - Divine trinity */}
            {i % 5 === 3 && (
              <g>
                <polygon
                  points="25,10 40,35 10,35"
                  fill="none"
                  stroke={`url(#triangleGrad${i})`}
                  strokeWidth="2"
                />
                <circle cx="25" cy="25" r="3" fill={`url(#triangleGrad${i})`} opacity="0.8" />
              </g>
            )}
            
            {/* Flower of Life - Sacred pattern */}
            {i % 5 === 4 && (
              <g>
                <circle cx="25" cy="25" r="8" fill="none" stroke={`url(#flowerGrad${i})`} strokeWidth="1.5" />
                <circle cx="18" cy="18" r="6" fill="none" stroke={`url(#flowerGrad${i})`} strokeWidth="1" opacity="0.6" />
                <circle cx="32" cy="18" r="6" fill="none" stroke={`url(#flowerGrad${i})`} strokeWidth="1" opacity="0.6" />
                <circle cx="25" cy="32" r="6" fill="none" stroke={`url(#flowerGrad${i})`} strokeWidth="1" opacity="0.6" />
              </g>
            )}
            
            <defs>
              <linearGradient id={`venusGrad${i}`}>
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f87171" />
              </linearGradient>
              <linearGradient id={`infinityGrad${i}`}>
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <radialGradient id={`heartMandalaGrad${i}`}>
                <stop offset="0%" stopColor="#fecaca" />
                <stop offset="100%" stopColor="#dc2626" />
              </radialGradient>
              <linearGradient id={`triangleGrad${i}`}>
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
              <linearGradient id={`flowerGrad${i}`}>
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </>
  );
};
