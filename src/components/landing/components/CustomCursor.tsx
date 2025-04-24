
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface CursorProps {
  color?: string;
  size?: number;
  magneticElements?: string[];
}

export const CustomCursor: React.FC<CursorProps> = ({ 
  color = "rgba(155, 135, 245, 0.7)",
  size = 12,
  magneticElements = ["button", "a", ".interactive"]
}) => {
  // Use refs to avoid re-renders
  const position = {
    x: useMotionValue(-100),
    y: useMotionValue(-100)
  };
  
  // Spring physics for smooth movement
  const springConfig = { stiffness: 1000, damping: 50 };
  const cursorX = useSpring(position.x, springConfig);
  const cursorY = useSpring(position.y, springConfig);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasMovedOnce, setHasMovedOnce] = useState(false);
  const magneticElementsRef = useRef<Element[]>([]);
  const idleTimerRef = useRef<number | null>(null);

  // Hide cursor when idle
  const resetIdleTimer = () => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }
    
    setIsVisible(true);
    idleTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };
  
  // Track cursor position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      position.x.set(e.clientX);
      position.y.set(e.clientY);
      
      if (!hasMovedOnce) {
        setHasMovedOnce(true);
        setTimeout(() => setIsVisible(true), 500);
      }
      
      resetIdleTimer();
      checkHoverState(e);
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    const checkHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isOverMagneticElement = magneticElementsRef.current.some(
        element => element.contains(target)
      );
      setIsHovering(isOverMagneticElement);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, [hasMovedOnce]);
  
  // Set up magnetic elements
  useEffect(() => {
    const findMagneticElements = () => {
      const elements: Element[] = [];
      magneticElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
          elements.push(element);
        });
      });
      magneticElementsRef.current = elements;
    };
    
    // Initial setup and periodic refresh of elements
    findMagneticElements();
    const interval = setInterval(findMagneticElements, 1000);
    
    return () => clearInterval(interval);
  }, [magneticElements]);
  
  // Don't show custom cursor on touch devices
  const isTouchDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: isHovering ? `40px` : `${size}px`,
            height: isHovering ? `40px` : `${size}px`,
            opacity: isClicking ? 0.9 : 0.7
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </motion.div>
      
      {/* Trailing cursor effect - optimized to avoid reflow */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        transition={{ type: "spring", stiffness: 100, damping: 25 }}
      >
        <motion.div
          className="rounded-full bg-luxury-primary/30"
          style={{
            width: "30px", 
            height: "30px",
            filter: "blur(5px)",
          }}
          animate={{
            scale: isHovering ? 2.2 : isClicking ? 0.8 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        />
      </motion.div>
    </>
  );
};
