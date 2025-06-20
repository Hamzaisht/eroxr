
import { motion } from "framer-motion";

export const GreekPatternSVG = () => {
  return (
    <div className="absolute inset-0">
      <svg
        className="absolute inset-0 w-full h-full opacity-8"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Temple of Love Pattern */}
          <pattern
            id="templePattern"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            >
              {/* Greek Temple Columns */}
              <rect x="10" y="20" width="3" height="40" fill="url(#templeGradient1)" opacity="0.4" />
              <rect x="20" y="20" width="3" height="40" fill="url(#templeGradient1)" opacity="0.4" />
              <rect x="30" y="20" width="3" height="40" fill="url(#templeGradient1)" opacity="0.4" />
              <rect x="40" y="20" width="3" height="40" fill="url(#templeGradient1)" opacity="0.4" />
              
              {/* Temple Base and Roof */}
              <rect x="8" y="60" width="30" height="4" fill="url(#templeGradient2)" opacity="0.5" />
              <polygon points="8,20 23,10 38,20 38,24 8,24" fill="url(#templeGradient2)" opacity="0.5" />
              
              {/* Love Knot Pattern */}
              <path
                d="M50,30 Q60,20 70,30 Q60,40 50,30 M60,30 Q70,20 80,30 Q70,40 60,30"
                stroke="url(#knotGradient)"
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />
            </motion.g>
          </pattern>

          {/* Sacred Geometry of Love */}
          <pattern
            id="loveGeometry"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <motion.g
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              {/* Golden Ratio Spiral */}
              <path
                d="M30,30 Q45,15 60,30 Q45,45 30,30 Q15,15 30,30"
                stroke="url(#spiralGradient)"
                strokeWidth="1"
                fill="none"
                opacity="0.4"
              />
              
              {/* Sacred Triangle */}
              <polygon
                points="30,10 45,40 15,40"
                stroke="url(#triangleGradient)"
                strokeWidth="1"
                fill="none"
                opacity="0.3"
              />
            </motion.g>
          </pattern>

          {/* Gradient Definitions */}
          <linearGradient id="templeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          
          <linearGradient id="templeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          
          <linearGradient id="knotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          
          <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          
          <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#be185d" />
          </linearGradient>
        </defs>
        
        {/* Temple of Love Background */}
        <rect width="100%" height="100%" fill="url(#templePattern)" />
        
        {/* Sacred Geometry Overlay */}
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#loveGeometry)" 
          transform="rotate(30 400 400) scale(0.8)"
          opacity="0.4"
        />
        
        {/* Divine Light Rays */}
        <motion.g
          animate={{
            rotate: [0, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            rotate: { duration: 45, repeat: Infinity, ease: "linear" },
            opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1="400"
              y1="400"
              x2={400 + Math.cos(i * Math.PI / 4) * 300}
              y2={400 + Math.sin(i * Math.PI / 4) * 300}
              stroke="url(#templeGradient1)"
              strokeWidth="0.5"
              opacity="0.2"
            />
          ))}
        </motion.g>
      </svg>
    </div>
  );
};
