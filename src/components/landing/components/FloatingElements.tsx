
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-mobile";

export const FloatingElements = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = e;
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      // Convert to -1 to 1 range for each axis
      const x = (clientX / width) * 2 - 1;
      const y = (clientY / height) * 2 - 1;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  // Create different shapes with parallax effect
  const elements = [
    {
      shape: "circle",
      color: "bg-luxury-primary/30",
      size: "w-64 h-64 lg:w-96 lg:h-96",
      position: "top-10 -right-20",
      parallaxFactor: 0.04,
      blur: "blur-3xl",
      animation: "animate-float",
    },
    {
      shape: "circle",
      color: "bg-luxury-accent/20",
      size: "w-96 h-96 lg:w-[600px] lg:h-[600px]",
      position: "left-1/3 -bottom-40",
      parallaxFactor: 0.02,
      blur: "blur-3xl",
      animation: "animate-pulse",
    },
    {
      shape: "custom-1",
      color: "bg-gradient-to-br from-luxury-primary/30 to-luxury-accent/20",
      size: "w-72 h-72",
      position: "-top-10 -left-10",
      parallaxFactor: 0.05,
      blur: "blur-2xl",
      animation: "animate-float",
    },
    {
      shape: "rect",
      color: "bg-luxury-primary/20",
      size: "w-40 h-80",
      position: "bottom-20 right-[10%]",
      parallaxFactor: 0.03,
      blur: "blur-2xl",
      animation: "animate-pulse",
      rotateZ: 45,
    },
    {
      shape: "rect",
      color: "bg-luxury-accent/15",
      size: "w-40 h-40",
      position: "top-1/3 left-[15%]",
      parallaxFactor: 0.06,
      blur: "blur-xl",
      animation: "animate-float",
      rotateZ: 30,
    },
  ];

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {!isMobile && elements.map((el, index) => {
        // Calculate parallax offset based on mouse position
        const offsetX = mousePosition.x * el.parallaxFactor * 100;
        const offsetY = mousePosition.y * el.parallaxFactor * 100;
        
        return (
          <motion.div
            key={index}
            className={`absolute ${el.size} ${el.position} ${el.color} ${el.blur} ${el.animation} rounded-full opacity-70`}
            animate={{
              x: offsetX,
              y: offsetY,
              rotate: el.rotateZ,
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 60,
              restDelta: 0.001,
            }}
            style={{
              filter: `blur(${parseInt(el.blur.split('-')[1]) / 4}px)`,
            }}
          />
        );
      })}
      
      {/* Additional decorative elements */}
      <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-luxury-primary rounded-full animate-pulse" />
      <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-luxury-accent rounded-full animate-pulse" />
      <div className="absolute top-2/3 left-1/5 w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse" />
      
      {/* Lines that connect on hover */}
      <svg className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
        <motion.path
          stroke="url(#gradient-line)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="5,10"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          d={`M${30 + mousePosition.x * 20},${100 + mousePosition.y * 10} Q${300 + mousePosition.x * -30},${200 + mousePosition.y * 20} ${500 + mousePosition.x * 40},${400 + mousePosition.y * -20}`}
        />
        <defs>
          <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(155, 135, 245, 0.3)" />
            <stop offset="100%" stopColor="rgba(217, 70, 239, 0.3)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
