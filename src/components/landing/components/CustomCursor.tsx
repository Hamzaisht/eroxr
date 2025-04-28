
import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface CursorProps {
  color?: string;
  size?: number;
  trailEffect?: boolean;
  magneticElements?: string[];
}

export const CustomCursor: React.FC<CursorProps> = ({ 
  color = "rgba(155, 135, 245, 0.7)",
  size = 12,
  trailEffect = true,
  magneticElements = ["button", "a", ".interactive"]
}) => {
  // Use motion values for smooth animations
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring physics for smooth movement
  const springConfig = { damping: 25, stiffness: 700 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);
  
  const trailX = useSpring(cursorX, { damping: 40, stiffness: 200 });
  const trailY = useSpring(cursorY, { damping: 40, stiffness: 200 });
  
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const magneticElementsRef = useRef<Element[]>([]);
  
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
    const interval = setInterval(findMagneticElements, 2000);
    
    return () => clearInterval(interval);
  }, [magneticElements]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      if (!hasMoved) {
        setHasMoved(true);
        setTimeout(() => setIsVisible(true), 500);
      }
      
      // Check if hovering over magnetic elements
      const target = e.target as HTMLElement;
      const isOverMagnetic = magneticElementsRef.current.some(
        element => element.contains(target)
      );
      setIsHovering(isOverMagnetic);
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, hasMoved]);
  
  // Don't show custom cursor on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }
  
  if (!isVisible) return null;
  
  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: isHovering ? `${size * 3}px` : `${size}px`,
            height: isHovering ? `${size * 3}px` : `${size}px`,
            opacity: isClicking ? 0.9 : 0.7
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </motion.div>
      
      {/* Cursor trail effect */}
      {trailEffect && (
        <motion.div
          className="fixed pointer-events-none z-[9998]"
          style={{
            x: trailX,
            y: trailY,
            translateX: "-50%",
            translateY: "-50%"
          }}
        >
          <motion.div
            className="rounded-full bg-luxury-primary/30"
            style={{
              width: "30px", 
              height: "30px",
              filter: "blur(5px)",
            }}
            animate={{
              scale: isHovering ? 2 : isClicking ? 0.8 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          />
        </motion.div>
      )}
    </>
  );
};

export default CustomCursor;
