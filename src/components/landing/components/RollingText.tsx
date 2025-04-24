
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";

interface RollingTextProps {
  children: string;
  href: string;
}

export const RollingText = ({ children, href }: RollingTextProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      to={href} 
      className="group relative inline-block overflow-hidden px-4 py-2 text-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span 
        className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-luxury-primary to-luxury-accent"
        animate={{ width: isHovered ? '100%' : '0%' }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative overflow-hidden h-[1.5em]">
        <motion.span 
          className="block transition-transform duration-300"
          animate={{ y: isHovered ? '-100%' : '0%' }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
        >
          {children}
        </motion.span>
        <motion.span 
          className="absolute left-0 top-full block"
          animate={{ y: isHovered ? '-100%' : '0%' }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
        >
          <span className="bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
            {children}
          </span>
        </motion.span>
      </div>
    </Link>
  );
};
