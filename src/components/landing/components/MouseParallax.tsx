
import React, { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MouseParallaxProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export const MouseParallax: React.FC<MouseParallaxProps> = ({ 
  children, 
  className = "",
  strength = 0.05
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Initialize window size
    handleResize();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const x = windowSize.width > 0 ? (mousePosition.x / windowSize.width - 0.5) * strength : 0;
  const y = windowSize.height > 0 ? (mousePosition.y / windowSize.height - 0.5) * strength : 0;
  
  return (
    <motion.div 
      className={className}
      style={{
        x: x * -100,
        y: y * -100,
      }}
      transition={{ type: 'spring', stiffness: 75, damping: 30, mass: 0.5 }}
    >
      {children}
    </motion.div>
  );
};
