
import { useState, useEffect, useRef, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MouseParallaxProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export const MouseParallax = ({ 
  children, 
  className, 
  strength = 0.03 
}: MouseParallaxProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMousePosition = useRef({ x: 0, y: 0 });
  const isEnabled = useRef(true);

  useEffect(() => {
    // Disable on mobile devices
    if (window.matchMedia("(max-width: 768px)").matches) {
      isEnabled.current = false;
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isEnabled.current || !containerRef.current) return;

      const { clientX, clientY } = e;
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      // Convert to normalized coordinates (-1 to 1)
      const x = (clientX / width) * 2 - 1;
      const y = (clientY / height) * 2 - 1;
      
      // Apply smoothing by averaging with previous position
      const smoothedX = (x * 0.3) + (prevMousePosition.current.x * 0.7);
      const smoothedY = (y * 0.3) + (prevMousePosition.current.y * 0.7);
      
      setMousePosition({ x: smoothedX, y: smoothedY });
      prevMousePosition.current = { x: smoothedX, y: smoothedY };
    };
    
    // Handle visibility change
    const handleVisibilityChange = () => {
      isEnabled.current = document.visibilityState === "visible";
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative", className)}
      style={{
        x: mousePosition.x * -strength * 100,
        y: mousePosition.y * -strength * 100,
        transition: "transform 0.15s ease-out",
      }}
    >
      {children}
    </motion.div>
  );
};
