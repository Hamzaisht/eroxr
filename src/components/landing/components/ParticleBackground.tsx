
import { useRef, useEffect, useState, memo } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";

export const ParticleBackground = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Array<{x: number, y: number, size: number, speed: number, opacity: number}>>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { x: parallaxX, y: parallaxY } = useMouseParallax(0.05, 30);

  // Generate particles on mount
  useEffect(() => {
    const newParticles = [];
    const count = Math.min(window.innerWidth / 15, 80); // Adjust for performance
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 1 + 0.2,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    
    setParticles(newParticles);
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      if (containerRef.current) {
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (clientX - left) / width;
        const y = (clientY - top) / height;
        
        mouseX.set(x);
        mouseY.set(y);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        x: parallaxX,
        y: parallaxY
      }}
    >
      <div className="h-full w-full absolute">
        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-luxury-primary"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
            }}
            animate={{
              y: ["0%", `${particle.speed * 50}%`],
              opacity: [particle.opacity, 0],
            }}
            transition={{
              duration: 5 + particle.speed * 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: index * 0.05,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
});

ParticleBackground.displayName = "ParticleBackground";
