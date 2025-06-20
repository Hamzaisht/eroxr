
import { motion } from "framer-motion";

export const FloatingGeometrics = () => {
  return (
    <>
      {/* Floating Geometric Elements with Complex Paths */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute opacity-20"
          style={{
            left: `${20 + (i * 7) % 80}%`,
            top: `${15 + (i * 11) % 70}%`,
            width: `${20 + (i % 3) * 10}px`,
            height: `${20 + (i % 3) * 10}px`,
          }}
          animate={{
            rotate: [0, 360],
            x: [0, Math.sin(i) * 50, 0],
            y: [0, Math.cos(i) * 30, 0],
            scale: [1, 1.2 + (i % 2) * 0.3, 1],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          <svg viewBox="0 0 40 40" className="w-full h-full">
            {i % 4 === 0 && (
              <polygon
                points="20,5 35,15 35,25 20,35 5,25 5,15"
                fill="none"
                stroke={`url(#grad${i % 3})`}
                strokeWidth="1.5"
              />
            )}
            {i % 4 === 1 && (
              <circle
                cx="20" cy="20" r="15"
                fill="none"
                stroke={`url(#grad${i % 3})`}
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            )}
            {i % 4 === 2 && (
              <rect
                x="8" y="8" width="24" height="24"
                fill="none"
                stroke={`url(#grad${i % 3})`}
                strokeWidth="1"
                transform="rotate(45 20 20)"
              />
            )}
            {i % 4 === 3 && (
              <path
                d="M20,10 L25,20 L20,30 L15,20 Z"
                fill="none"
                stroke={`url(#grad${i % 3})`}
                strokeWidth="1.5"
              />
            )}
            <defs>
              <linearGradient id={`grad${i % 3}`}>
                <stop offset="0%" stopColor={i % 3 === 0 ? "#ec4899" : i % 3 === 1 ? "#8b5cf6" : "#06b6d4"} />
                <stop offset="100%" stopColor={i % 3 === 0 ? "#8b5cf6" : i % 3 === 1 ? "#06b6d4" : "#ec4899"} />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </>
  );
};
