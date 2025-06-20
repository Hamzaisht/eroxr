
import { motion } from "framer-motion";

export const ErosSymbols = () => {
  return (
    <>
      {/* The Arrow of Love - Central mythological element */}
      <motion.div
        className="absolute top-1/6 left-1/4 w-96 h-96 opacity-10"
        animate={{ 
          rotate: [0, 360],
          scale: [0.8, 1.1, 0.8]
        }}
        transition={{ 
          rotate: { duration: 45, repeat: Infinity, ease: "linear" },
          scale: { duration: 12, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <g transform="translate(100,100)">
            {/* Golden Bow of Desire */}
            <motion.path
              d="M-70,-25 Q0,-90 70,-25 Q0,50 -70,-25"
              fill="none"
              stroke="url(#goldenBowGradient)"
              strokeWidth="4"
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0.2, 0.9, 0.2],
                filter: ["blur(2px)", "blur(0px)", "blur(2px)"]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* The Arrow of Destiny */}
            <motion.g
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              <line
                x1="0" y1="-70"
                x2="0" y2="70"
                stroke="url(#arrowShaftGradient)"
                strokeWidth="3"
                opacity="0.8"
              />
              <path
                d="M0,-70 L-8,-55 L8,-55 Z"
                fill="url(#arrowHeadGradient)"
                opacity="0.9"
              />
              <path
                d="M-6,65 L0,70 L6,65 M-6,55 L0,60 L6,55"
                stroke="url(#arrowFletchingGradient)"
                strokeWidth="2"
                fill="none"
                opacity="0.7"
              />
            </motion.g>
            
            {/* Heart of Love - Pulsing with life */}
            <motion.path
              d="M0,0 C0,-10 -10,-10 -10,0 C-10,10 0,20 0,20 C0,20 10,10 10,0 C10,-10 0,-10 0,0"
              fill="url(#heartGradient)"
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.6, 1, 0.6],
                filter: ["blur(1px)", "blur(0px)", "blur(1px)"]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </g>
          
          <defs>
            <linearGradient id="goldenBowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="arrowShaftGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e5e7eb" />
              <stop offset="50%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#6b7280" />
            </linearGradient>
            <linearGradient id="arrowHeadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="arrowFletchingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <radialGradient id="heartGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#f87171" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.9" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Cupid's Wings - Symbol of divine messenger */}
      <motion.div
        className="absolute bottom-1/3 right-1/5 w-80 h-80 opacity-8"
        animate={{ 
          rotate: [-5, 5, -5],
          y: [0, -20, 0],
          scale: [0.9, 1.2, 0.9]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <g transform="translate(100,100)">
            {/* Left Wing */}
            <motion.path
              d="M-20,0 Q-60,-40 -80,-10 Q-70,20 -40,25 Q-25,15 -20,0"
              fill="url(#wingGradient1)"
              animate={{
                d: [
                  "M-20,0 Q-60,-40 -80,-10 Q-70,20 -40,25 Q-25,15 -20,0",
                  "M-20,0 Q-65,-45 -85,-5 Q-75,25 -35,30 Q-20,20 -20,0",
                  "M-20,0 Q-60,-40 -80,-10 Q-70,20 -40,25 Q-25,15 -20,0"
                ],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Right Wing */}
            <motion.path
              d="M20,0 Q60,-40 80,-10 Q70,20 40,25 Q25,15 20,0"
              fill="url(#wingGradient2)"
              animate={{
                d: [
                  "M20,0 Q60,-40 80,-10 Q70,20 40,25 Q25,15 20,0",
                  "M20,0 Q65,-45 85,-5 Q75,25 35,30 Q20,20 20,0",
                  "M20,0 Q60,-40 80,-10 Q70,20 40,25 Q25,15 20,0"
                ],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </g>
          
          <defs>
            <radialGradient id="wingGradient1" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </radialGradient>
            <radialGradient id="wingGradient2" cx="70%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.4" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Rose Petals - Symbol of romantic love */}
      <motion.div
        className="absolute top-1/2 right-1/6 w-32 h-32 opacity-12"
        animate={{ 
          rotate: [0, 360],
          scale: [0.8, 1.3, 0.8]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <g transform="translate(50,50)">
            {/* Rose petals arranged in a circle */}
            {[...Array(6)].map((_, i) => (
              <motion.path
                key={i}
                d="M0,-20 Q-8,-30 -15,-20 Q-8,-10 0,-15 Q8,-10 15,-20 Q8,-30 0,-20"
                fill="url(#petalGradient)"
                transform={`rotate(${i * 60})`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3
                }}
              />
            ))}
            
            {/* Center of rose */}
            <circle
              cx="0" cy="0" r="4"
              fill="url(#roseCenterGradient)"
            />
          </g>
          
          <defs>
            <radialGradient id="petalGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fecaca" />
              <stop offset="50%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </radialGradient>
            <radialGradient id="roseCenterGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
    </>
  );
};
