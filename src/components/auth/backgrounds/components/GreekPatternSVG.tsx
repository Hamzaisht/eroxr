
import { motion } from "framer-motion";

export const GreekPatternSVG = () => {
  return (
    <div className="absolute inset-0">
      <svg
        className="absolute inset-0 w-full h-full opacity-3"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Simple dot pattern */}
          <pattern
            id="dotPattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="20" cy="20" r="1" fill="rgba(59, 130, 246, 0.1)" />
          </pattern>
        </defs>
        
        {/* Simple dot background */}
        <rect width="100%" height="100%" fill="url(#dotPattern)" />
      </svg>
    </div>
  );
};
