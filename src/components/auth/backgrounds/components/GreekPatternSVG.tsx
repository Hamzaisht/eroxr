
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
          {/* Sacred geometry pattern */}
          <pattern
            id="sacredGeometry"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* Greek meander pattern */}
            <path
              d="M20,20 L60,20 L60,60 L40,60 L40,40 L50,40"
              stroke="rgba(168, 85, 247, 0.08)"
              strokeWidth="1"
              fill="none"
            />
            {/* Egyptian ankh symbol simplified */}
            <circle cx="40" cy="30" r="3" fill="rgba(245, 158, 11, 0.06)" />
            <rect x="39" y="33" width="2" height="8" fill="rgba(245, 158, 11, 0.06)" />
            {/* Japanese torii gate element */}
            <path
              d="M25,55 L55,55 M30,50 L30,60 M50,50 L50,60"
              stroke="rgba(6, 182, 212, 0.05)"
              strokeWidth="1"
            />
          </pattern>
          
          {/* Wealth symbols pattern */}
          <pattern
            id="wealthPattern"
            x="0"
            y="0"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            {/* Stylized coins */}
            <circle cx="30" cy="30" r="4" stroke="rgba(245, 158, 11, 0.1)" strokeWidth="1" fill="none" />
            <circle cx="90" cy="90" r="4" stroke="rgba(245, 158, 11, 0.1)" strokeWidth="1" fill="none" />
            {/* Egyptian scarab pattern */}
            <ellipse cx="60" cy="60" rx="6" ry="4" stroke="rgba(245, 158, 11, 0.08)" strokeWidth="1" fill="none" />
          </pattern>
        </defs>
        
        {/* Sacred geometry background */}
        <rect width="100%" height="100%" fill="url(#sacredGeometry)" />
        
        {/* Wealth symbols overlay */}
        <rect width="100%" height="100%" fill="url(#wealthPattern)" opacity="0.6" />
      </svg>
    </div>
  );
};
