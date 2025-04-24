
import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export const useMouseParallax = (
  sensitivity: number = 0.05,
  damping: number = 50
) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const x = useSpring(mouseX, { stiffness: 400, damping });
  const y = useSpring(mouseY, { stiffness: 400, damping });
  
  useEffect(() => {
    let requestId: number | null = null;
    let mouse = { x: 0, y: 0 };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse = {
        x: (e.clientX - window.innerWidth / 2) * sensitivity,
        y: (e.clientY - window.innerHeight / 2) * sensitivity
      };
      
      if (!requestId) {
        requestId = requestAnimationFrame(updateMousePosition);
      }
    };
    
    const updateMousePosition = () => {
      mouseX.set(mouse.x);
      mouseY.set(mouse.y);
      requestId = null;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestId) cancelAnimationFrame(requestId);
    };
  }, [mouseX, mouseY, sensitivity]);
  
  return { x, y };
};
