
import { useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-mobile";

const CSSParticlesBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Determine particle count based on device
  const particleCount = isMobile ? 20 : 40;
  
  // Generate particles with randomized properties
  const generateParticles = () => {
    return Array.from({ length: particleCount }).map((_, i) => {
      const size = Math.random() * 3 + 0.5;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 40 + 20;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.5 + 0.1;
      const color = [
        "rgba(155, 135, 245, 0.8)",
        "rgba(217, 70, 239, 0.8)",
        "rgba(126, 105, 171, 0.8)",
        "rgba(255, 255, 255, 0.5)",
      ][Math.floor(Math.random() * 4)];

      return { id: i, size, x, y, duration, delay, opacity, color };
    });
  };
  
  const particles = generateParticles();
  
  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full will-change-transform"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
          }}
          animate={{
            x: [
              Math.random() * 20 - 10,
              Math.random() * 20 - 10,
              Math.random() * 20 - 10,
              Math.random() * 20 - 10
            ],
            y: [
              Math.random() * 20 - 10,
              Math.random() * 20 - 10,
              Math.random() * 20 - 10,
              Math.random() * 20 - 10
            ],
            opacity: [
              particle.opacity,
              particle.opacity + 0.1,
              particle.opacity
            ]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
      
      {/* Add subtle connections between particles */}
      <div 
        className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"
        style={{
          maskImage: 'radial-gradient(white, transparent 80%)'
        }}
      />
    </motion.div>
  );
};

export default CSSParticlesBackground;
