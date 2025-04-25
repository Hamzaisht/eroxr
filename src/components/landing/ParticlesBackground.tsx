
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    // Define particle properties
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }
    
    // Create particles
    const particlesArray: Particle[] = [];
    const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 25000));
    
    const colors = [
      "rgba(155, 135, 245, 0.8)", // Luxury primary
      "rgba(217, 70, 239, 0.8)",  // Luxury accent
      "rgba(126, 105, 171, 0.8)", // Luxury secondary
      "rgba(255, 255, 255, 0.5)", // White
    ];
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 3 + 0.5;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const speedX = Math.random() * 0.5 - 0.25;
      const speedY = Math.random() * 0.5 - 0.25;
      const opacity = Math.random() * 0.5 + 0.2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particlesArray.push({
        x, 
        y,
        size,
        speedX,
        speedY,
        opacity,
        color
      });
    }
    
    // Create connections
    const connect = () => {
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < canvas.width / 10) {
            const opacity = 1 - (distance / (canvas.width / 10));
            ctx.strokeStyle = `rgba(155, 135, 245, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesArray.forEach(particle => {
        // Update positions
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Boundary checks
        if (particle.x > canvas.width) {
          particle.x = 0;
        } else if (particle.x < 0) {
          particle.x = canvas.width;
        }
        
        if (particle.y > canvas.height) {
          particle.y = 0;
        } else if (particle.y < 0) {
          particle.y = canvas.height;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      connect();
    };
    
    animate();
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 bg-transparent z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    />
  );
};

export default ParticlesBackground;
