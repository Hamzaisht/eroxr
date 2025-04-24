
import { ReactNode, useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface SmoothScrollProps {
  children: ReactNode;
}

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
  // Only enable smooth scroll on desktop
  const [shouldUseSmooth, setShouldUseSmooth] = useState(false);
  
  useEffect(() => {
    const checkIfDesktop = () => {
      setShouldUseSmooth(window.innerWidth >= 1024);
    };
    
    checkIfDesktop();
    window.addEventListener('resize', checkIfDesktop);
    
    return () => {
      window.removeEventListener('resize', checkIfDesktop);
    };
  }, []);
  
  // If not desktop, return children directly
  if (!shouldUseSmooth) {
    return <>{children}</>;
  }
  
  return <SmoothScrollImplementation>{children}</SmoothScrollImplementation>;
};

const SmoothScrollImplementation = ({ children }: SmoothScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageHeight, setPageHeight] = useState(0);
  
  const { scrollY } = useScroll();
  const transform = useTransform(scrollY, [0, pageHeight], [0, -pageHeight]);
  const physics = { damping: 15, mass: 0.27, stiffness: 55 }; // adjust for speed
  const spring = useSpring(transform, physics);
  
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setPageHeight(containerRef.current.scrollHeight);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', updateHeight);
      resizeObserver.disconnect();
    };
  }, []);
  
  return (
    <>
      <motion.div
        ref={containerRef}
        style={{ y: spring }}
        className="fixed top-0 left-0 w-full will-change-transform"
      >
        {children}
      </motion.div>
      <div style={{ height: pageHeight }} />
    </>
  );
};
