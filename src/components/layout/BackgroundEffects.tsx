
import { memo, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export const BackgroundEffects = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isCanvasSupported = typeof window !== 'undefined' && !!window.CanvasRenderingContext2D;
  
  useEffect(() => {
    if (!canvasRef.current || !isCanvasSupported) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match window
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Particle class for advanced control
    class Particle {
      x: number;
      y: number;
      size: number;
      baseSize: number;
      speedX: number;
      speedY: number;
      maxSpeed: number;
      color: string;
      alpha: number;
      baseAlpha: number;
      targetAlpha: number;
      mousePull: number;
      
      constructor(x: number, y: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseSize = size;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.maxSpeed = 0.5;
        this.color = color;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.baseAlpha = this.alpha;
        this.targetAlpha = this.alpha;
        this.mousePull = Math.random() * 0.3 + 0.02;
      }
      
      update(mouseX: number | null, mouseY: number | null) {
        // Regular movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Mouse attraction
        if (mouseX !== null && mouseY !== null) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;
          
          if (distance < maxDistance) {
            // Attracted to mouse
            const force = (maxDistance - distance) / maxDistance;
            const dirX = dx / distance || 0;
            const dirY = dy / distance || 0;
            this.speedX += dirX * force * this.mousePull;
            this.speedY += dirY * force * this.mousePull;
            
            // Highlight when near mouse
            this.targetAlpha = this.baseAlpha * 2;
            this.size = this.baseSize * (1 + force * 0.5);
          } else {
            this.targetAlpha = this.baseAlpha;
            this.size = this.baseSize;
          }
        }
        
        // Smooth alpha transition
        this.alpha += (this.targetAlpha - this.alpha) * 0.1;
        
        // Speed limits
        this.speedX = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.speedX));
        this.speedY = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.speedY));
        
        // Edge wrapping with buffer zone
        const buffer = 50;
        if (this.x < -buffer) this.x = canvas.width + buffer;
        if (this.x > canvas.width + buffer) this.x = -buffer;
        if (this.y < -buffer) this.y = canvas.height + buffer;
        if (this.y > canvas.height + buffer) this.y = -buffer;
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace(')', `,${this.alpha})`);
        ctx.fill();
      }
    }
    
    // Connection class for line drawing
    class Connection {
      draw(ctx: CanvasRenderingContext2D, p1: Particle, p2: Particle, distance: number, maxDistance: number) {
        const opacity = 1 - (distance / maxDistance);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(155, 135, 245, ${opacity * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    
    // Create particles
    const colorPalette = [
      'rgba(155, 135, 245', // Luxury primary
      'rgba(217, 70, 239',  // Luxury accent
      'rgba(255, 255, 255',
    ];
    
    const connection = new Connection();
    const particles: Particle[] = [];
    const particleDensity = Math.min(window.devicePixelRatio || 1, 2);
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 25000) * particleDensity);
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 2 + 0.5;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      
      particles.push(new Particle(x, y, size, color));
    }
    
    // Mouse tracking
    let mouseX: number | null = null;
    let mouseY: number | null = null;
    let isMouseMoving = false;
    let mouseTimer: number | null = null;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseMoving = true;
      
      if (mouseTimer !== null) {
        window.clearTimeout(mouseTimer);
      }
      
      mouseTimer = window.setTimeout(() => {
        isMouseMoving = false;
      }, 100);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    let animationFrame: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouseX, mouseY);
        particles[i].draw(ctx);
        
        // Connect particles (optimization: only check forward)
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = isMouseMoving ? 150 : 100;
          
          if (distance < maxDistance) {
            connection.draw(ctx, particles[i], particles[j], distance, maxDistance);
          }
        }
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [isCanvasSupported]);
  
  return (
    <>
      {/* WebGL Canvas for particles */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.75 }}
      />
      
      {/* Grid pattern with optimized masking */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_80%)] opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-dark/50 via-luxury-darker/30 to-luxury-dark/50" />
      </div>
      
      {/* Animated gradient orbs with better performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.15, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-luxury-primary/10 blur-3xl"
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.15, 0.1],
            scale: [1, 1.15, 1],
          }}
          transition={{ 
            duration: 7,
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-luxury-accent/10 blur-3xl"
        />
      </div>

      {/* Dynamic chromatic aberration effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.035]"
        style={{
          backdropFilter: 'blur(0.5px)',
          mixBlendMode: 'overlay',
        }}
      >
        <div 
          className="absolute inset-0 -ml-[2px] bg-red-500/10" 
          style={{ mixBlendMode: 'screen' }}
        />
        <div 
          className="absolute inset-0 ml-[2px] bg-blue-500/10" 
          style={{ mixBlendMode: 'screen' }}
        />
      </div>
      
      {/* Subtle grain texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
});

BackgroundEffects.displayName = "BackgroundEffects";

export default BackgroundEffects;
