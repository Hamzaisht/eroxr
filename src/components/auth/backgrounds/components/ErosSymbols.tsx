
import { motion } from "framer-motion";

export const ErosSymbols = () => {
  return (
    <>
      {/* Greek Aphrodite/Eros symbol - Top left */}
      <motion.div
        className="absolute top-1/5 left-1/5 w-24 h-24 opacity-6"
        animate={{ 
          rotate: [0, 360],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{ 
          rotate: { duration: 80, repeat: Infinity, ease: "linear" },
          scale: { duration: 12, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Stylized heart with Greek flair */}
          <path 
            d="M50,75 C50,75 20,50 20,35 C20,25 27,20 35,20 C42,20 50,25 50,35 C50,25 58,20 65,20 C73,20 80,25 80,35 C80,50 50,75 50,75 Z"
            fill="none" 
            stroke="rgba(244, 114, 182, 0.3)" 
            strokeWidth="2"
          />
          {/* Greek key pattern inside */}
          <path
            d="M40,45 L45,45 L45,50 L50,50 L50,45 L60,45"
            stroke="rgba(244, 114, 182, 0.2)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* Egyptian Hathor symbol - Top right */}
      <motion.div
        className="absolute top-1/4 right-1/5 w-20 h-20 opacity-5"
        animate={{ 
          rotate: [0, -360],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ 
          rotate: { duration: 100, repeat: Infinity, ease: "linear" },
          scale: { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Egyptian sun disk with horns */}
          <circle cx="50" cy="40" r="15" fill="none" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="2" />
          {/* Horns */}
          <path
            d="M35,40 Q30,25 35,35 M65,40 Q70,25 65,35"
            stroke="rgba(245, 158, 11, 0.2)"
            strokeWidth="2"
            fill="none"
          />
          {/* Ankh below */}
          <circle cx="50" cy="65" r="4" fill="none" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1.5" />
          <line x1="50" y1="69" x2="50" y2="80" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1.5" />
          <line x1="46" y1="75" x2="54" y2="75" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1.5" />
        </svg>
      </motion.div>

      {/* Japanese Benzaiten symbol - Bottom left */}
      <motion.div
        className="absolute bottom-1/4 left-1/6 w-18 h-18 opacity-4"
        animate={{ 
          rotate: [0, 360],
          scale: [0.7, 1.3, 0.7]
        }}
        transition={{ 
          rotate: { duration: 120, repeat: Infinity, ease: "linear" },
          scale: { duration: 16, repeat: Infinity, ease: "easeInOut", delay: 6 }
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Stylized torii gate */}
          <path
            d="M20,40 L80,40 M25,35 L25,50 M75,35 L75,50 M30,45 L70,45"
            stroke="rgba(6, 182, 212, 0.2)"
            strokeWidth="2"
            fill="none"
          />
          {/* Sacred circle */}
          <circle cx="50" cy="65" r="8" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1.5" />
          {/* Zen wave */}
          <path
            d="M35,75 Q50,70 65,75"
            stroke="rgba(6, 182, 212, 0.15)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* Combination wealth symbol - Bottom right */}
      <motion.div
        className="absolute bottom-1/5 right-1/4 w-16 h-16 opacity-4"
        animate={{ 
          rotate: [0, -360],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{ 
          rotate: { duration: 90, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 9 }
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Overlapping circles - sacred geometry */}
          <circle cx="40" cy="50" r="12" fill="none" stroke="rgba(168, 85, 247, 0.15)" strokeWidth="1.5" />
          <circle cx="60" cy="50" r="12" fill="none" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1.5" />
          {/* Central connection point */}
          <circle cx="50" cy="50" r="3" fill="rgba(244, 114, 182, 0.2)" />
        </svg>
      </motion.div>
    </>
  );
};
