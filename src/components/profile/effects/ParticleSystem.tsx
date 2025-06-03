
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  count?: number;
  colors?: string[];
  className?: string;
}

export const ParticleSystem = ({ 
  count = 50, 
  colors = ['#00d4ff', '#8b5cf6', '#f97316', '#06b6d4', '#a855f7'],
  className = "fixed inset-0 pointer-events-none" 
}: ParticleSystemProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set initial dimensions
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const createParticle = (id: number): Particle => ({
      id,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      },
      life: 0,
      maxLife: Math.random() * 300 + 200,
    });

    // Initialize particles only once
    setParticles(Array.from({ length: count }, (_, i) => createParticle(i)));

    // Animation loop
    intervalRef.current = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          const newParticle = { ...particle };
          
          // Update position
          newParticle.x += newParticle.velocity.x;
          newParticle.y += newParticle.velocity.y;
          
          // Update life
          newParticle.life += 1;
          
          // Wrap around screen edges
          if (newParticle.x < 0) newParticle.x = dimensions.width;
          if (newParticle.x > dimensions.width) newParticle.x = 0;
          if (newParticle.y < 0) newParticle.y = dimensions.height;
          if (newParticle.y > dimensions.height) newParticle.y = 0;
          
          // Reset particle if life exceeded
          if (newParticle.life > newParticle.maxLife) {
            return createParticle(particle.id);
          }
          
          return newParticle;
        })
      );
    }, 16); // ~60fps

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [count, colors, dimensions]);

  if (dimensions.width === 0 || dimensions.height === 0) {
    return null;
  }

  return (
    <div className={className}>
      {particles.map(particle => {
        const opacity = Math.max(0, 1 - (particle.life / particle.maxLife));
        
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: opacity * 0.6,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [opacity * 0.6, opacity * 0.8, opacity * 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};
