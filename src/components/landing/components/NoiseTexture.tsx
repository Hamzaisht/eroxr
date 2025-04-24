
import { useEffect, useRef } from 'react';

interface NoiseTextureProps {
  opacity?: number;
  className?: string;
}

export const NoiseTexture = ({ opacity = 0.05, className = "" }: NoiseTextureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const scale = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    
    // Scale context to match device pixel ratio
    ctx.scale(scale, scale);
    
    // Draw noise
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const buffer = new Uint32Array(imageData.data.buffer);
    
    for (let i = 0; i < buffer.length; i++) {
      // Generate random noise
      const noise = Math.random() * 255;
      
      // RGBA values
      buffer[i] = (255 << 24) | // alpha
                 (noise << 16) | // blue
                 (noise << 8) | // green
                 noise; // red
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Set canvas styling
    canvas.style.opacity = opacity.toString();
    
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth * scale;
        canvas.height = window.innerHeight * scale;
        ctx.scale(scale, scale);
        ctx.putImageData(imageData, 0, 0);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [opacity]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-10 mix-blend-overlay ${className}`}
    />
  );
};
