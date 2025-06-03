
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const createParticle = (id: number): Particle => ({
      id,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      },
      life: 0,
      maxLife: Math.random() * 300 + 200,
    });

    // Initialize particles
    const initialParticles = Array.from({ length: count }, (_, i) => createParticle(i));
    setParticles(initialParticles);

    // Animation loop
    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          const newParticle = { ...particle };
          
          // Update position
          newParticle.x += newParticle.velocity.x;
          newParticle.y += newParticle.velocity.y;
          
          // Update life
          newParticle.life += 1;
          
          // Wrap around screen edges
          if (newParticle.x < 0) newParticle.x = window.innerWidth;
          if (newParticle.x > window.innerWidth) newParticle.x = 0;
          if (newParticle.y < 0) newParticle.y = window.innerHeight;
          if (newParticle.y > window.innerHeight) newParticle.y = 0;
          
          // Reset particle if life exceeded
          if (newParticle.life > newParticle.maxLife) {
            return createParticle(particle.id);
          }
          
          return newParticle;
        })
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [count, colors]);

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
