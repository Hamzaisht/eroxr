
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CursorProps {
  color?: string;
}

export const CustomCursor: React.FC<CursorProps> = ({ 
  color = "rgba(155, 135, 245, 0.7)" 
}) => {
  const [position, setPosition] = useState({ x: -100, y: -100 }); // Start off-screen
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasMovedOnce, setHasMovedOnce] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      if (!hasMovedOnce) {
        setHasMovedOnce(true);
        setTimeout(() => setIsVisible(true), 500);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if hovering over interactive element
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("interactive")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    const addListenersToInteractiveElements = () => {
      const elements = document.querySelectorAll("button, a, .interactive");
      elements.forEach(element => {
        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    // Initial setup and periodic check for new elements
    addListenersToInteractiveElements();
    const interval = setInterval(addListenersToInteractiveElements, 2000);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      
      const elements = document.querySelectorAll("button, a, .interactive");
      elements.forEach(element => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
      
      clearInterval(interval);
    };
  }, [hasMovedOnce]);

  // Don't show custom cursor on touch devices
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: position.x,
          y: position.y,
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
        style={{ 
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-white"
          style={{
            width: isHovering ? "40px" : "12px", 
            height: isHovering ? "40px" : "12px",
            opacity: 0.7,
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
          }}
          animate={{
            opacity: isClicking ? 0.9 : 0.7,
          }}
        />
      </motion.div>
      
      {/* Trailing cursor effect */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 35,
          mass: 0.5,
        }}
        style={{ 
          translateX: "-50%",
          translateY: "-50%",
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
            scale: isHovering ? 2.2 : isClicking ? 0.8 : 1,
          }}
        />
      </motion.div>
    </>
  );
};
