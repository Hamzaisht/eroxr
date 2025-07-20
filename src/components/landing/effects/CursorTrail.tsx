import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export const CursorTrail = () => {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationId: number;
    
    const updateTrail = () => {
      setTrail(prevTrail => {
        const newTrail = [...prevTrail];
        
        // Add new point
        if (mousePosition.x !== 0 || mousePosition.y !== 0) {
          newTrail.push({
            x: mousePosition.x,
            y: mousePosition.y,
            id: Date.now()
          });
        }
        
        // Keep only last 15 points
        return newTrail.slice(-15);
      });
      
      animationId = requestAnimationFrame(updateTrail);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    updateTrail();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [mousePosition.x, mousePosition.y]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: point.x,
            top: point.y,
            background: `hsl(${271 + index * 5}, 100%, ${70 - index * 3}%)`,
            filter: 'blur(0.5px)',
          }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ 
            scale: 0,
            opacity: 0
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};
