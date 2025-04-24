
import React, { useRef, useEffect, useState } from 'react';
import { useMotionValue } from 'framer-motion';

interface ParticleBackgroundProps {
  count?: number;
  maxSpeed?: number;
  mouseInfluence?: number;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  count = 50,
  maxSpeed = 0.5,
  mouseInfluence = 100
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [ready, setReady] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);
  
  // Initialize particles
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Generate particles
    const newParticles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * maxSpeed,
      speedY: (Math.random() - 0.5) * maxSpeed,
      opacity: Math.random() * 0.5 + 0.1
    }));
    
    setParticles(newParticles);
    setReady(true);
    
    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [count, maxSpeed]);
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  // Animation loop
  useEffect(() => {
    if (!ready || !canvasRef.current || particles.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Mouse interaction
        const mouseXVal = mouseX.get();
        const mouseYVal = mouseY.get();
        const dx = particle.x - mouseXVal;
        const dy = particle.y - mouseYVal;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseInfluence) {
          const force = mouseInfluence / distance;
          particle.x += dx * force * 0.02;
          particle.y += dy * force * 0.02;
        }
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = `rgba(155, 135, 245, ${particle.opacity})`;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const otherParticle = particles[j];
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(155, 135, 245, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        }
      });
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(requestRef.current);
  }, [ready, particles, mouseInfluence, mouseX, mouseY]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
};
