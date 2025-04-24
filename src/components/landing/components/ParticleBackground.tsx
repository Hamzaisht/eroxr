
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  initialAlpha: number;
}

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const isMouseMoving = useRef(false);

  // Initialize particles
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        initParticles();
      }
    };

    const initParticles = () => {
      if (!canvasRef.current) return;
      
      const { width, height } = canvasRef.current;
      const particleCount = Math.floor((width * height) / 15000); // Responsive particle count
      
      particles.current = Array.from({ length: particleCount }).map(() => {
        const size = Math.random() * 2 + 0.5;
        const speedFactor = 0.05;
        
        // Create a color based on our luxury palette
        const colors = [
          "rgba(155, 135, 245, 0.8)", // luxury-primary
          "rgba(217, 70, 239, 0.8)",  // luxury-accent
          "rgba(229, 222, 255, 0.6)", // luxury-neutral
        ];
        
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          speedX: (Math.random() - 0.5) * speedFactor,
          speedY: (Math.random() - 0.5) * speedFactor,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.2,
          initialAlpha: Math.random() * 0.5 + 0.2,
        };
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      isMouseMoving.current = true;
      
      // Reset the movement tracker after a delay
      setTimeout(() => {
        isMouseMoving.current = false;
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    
    handleResize();
    animateParticles();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const animateParticles = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.current.forEach((particle) => {
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Handle edge cases
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        // Interactive behavior - particles respond to mouse
        if (isMouseMoving.current) {
          const dx = mousePosition.current.x - particle.x;
          const dy = mousePosition.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;
          
          if (distance < maxDistance) {
            // Particles within range get affected by mouse movement
            const force = (maxDistance - distance) / maxDistance;
            const angle = Math.atan2(dy, dx);
            
            particle.speedX -= Math.cos(angle) * force * 0.02;
            particle.speedY -= Math.sin(angle) * force * 0.02;
            
            // Brighten particles near cursor
            particle.alpha = Math.min(1, particle.initialAlpha + (force * 0.5));
          } else {
            // Reset alpha of particles outside the range
            particle.alpha = particle.alpha * 0.95 + particle.initialAlpha * 0.05;
          }
        } else {
          // Gradually reset alpha when mouse is not moving
          particle.alpha = particle.alpha * 0.98 + particle.initialAlpha * 0.02;
        }
        
        // Draw the particle
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Connect nearby particles with lines
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = "rgba(155, 135, 245, 0.15)";
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const dx = particles.current[i].x - particles.current[j].x;
          const dy = particles.current[i].y - particles.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 85) {
            ctx.beginPath();
            ctx.moveTo(particles.current[i].x, particles.current[i].y);
            ctx.lineTo(particles.current[j].x, particles.current[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  };

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    />
  );
};
