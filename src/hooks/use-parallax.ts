
import { useEffect } from 'react';
import { useMotionValue, useTransform, useSpring } from 'framer-motion';

export const useParallax = (
  strength: number = 100,
  direction: 'up' | 'down' | 'left' | 'right' = 'up'
) => {
  const scrollY = useMotionValue(0);
  
  useEffect(() => {
    const updateScroll = () => {
      scrollY.set(window.scrollY);
    };
    
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    
    return () => window.removeEventListener('scroll', updateScroll);
  }, [scrollY]);
  
  let transform;
  switch (direction) {
    case 'up':
      transform = useTransform(scrollY, [0, strength], [0, -strength]);
      break;
    case 'down':
      transform = useTransform(scrollY, [0, strength], [0, strength]);
      break;
    case 'left':
      transform = useTransform(scrollY, [0, strength], [0, -strength]);
      break;
    case 'right':
      transform = useTransform(scrollY, [0, strength], [0, strength]);
      break;
  }
  
  return {
    y: direction === 'up' || direction === 'down' ? transform : undefined,
    x: direction === 'left' || direction === 'right' ? transform : undefined,
  };
};
