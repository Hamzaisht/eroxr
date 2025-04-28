
import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useSpring } from 'framer-motion';

interface TextDistortionProps {
  text: string;
  className?: string;
  hoverEffect?: boolean;
  distortionFactor?: number;
  distortionSpeed?: number;
  characterDelay?: number;
}

export const TextDistortion: React.FC<TextDistortionProps> = ({
  text,
  className = '',
  hoverEffect = true,
  distortionFactor = 5,
  distortionSpeed = 0.1,
  characterDelay = 0.03,
}) => {
  const characters = text.split('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const controls = useAnimation();
  
  const distortionStrength = useMotionValue(0);
  const smoothDistortion = useSpring(distortionStrength, {
    damping: 40,
    stiffness: 300,
  });
  
  // Generate random offset values for each character
  const offsets = useRef(
    characters.map(() => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
    }))
  );
  
  useEffect(() => {
    if (!hoverEffect) {
      // If hover effect is disabled, animate continuously
      distortionStrength.set(Math.random() * distortionFactor * 0.3);
      
      const interval = setInterval(() => {
        distortionStrength.set(Math.random() * distortionFactor * 0.3);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [hoverEffect, distortionFactor, distortionStrength]);
  
  const handleHoverStart = () => {
    if (!hoverEffect) return;
    setIsHovering(true);
    distortionStrength.set(distortionFactor);
  };
  
  const handleHoverEnd = () => {
    if (!hoverEffect) return;
    setIsHovering(false);
    distortionStrength.set(0);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverEffect || !isHovering || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Distance from center (0 to 1)
    const distanceFromCenter = Math.sqrt(Math.pow(x - 0.5, 2) + Math.pow(y - 0.5, 2)) * 2;
    distortionStrength.set(distortionFactor * distanceFromCenter);
  };
  
  return (
    <motion.div 
      ref={containerRef}
      className={`inline-block ${className}`}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <span className="sr-only">{text}</span>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            x: smoothDistortion.get() ? 
              smoothDistortion.get() * offsets.current[index].x : 0,
            y: smoothDistortion.get() ? 
              smoothDistortion.get() * offsets.current[index].y : 0,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * characterDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TextDistortion;
