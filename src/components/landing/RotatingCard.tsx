
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export const RotatingCard = ({ className = "" }: { className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      console.info("RotatingCard component unmounted");
      setIsMounted(false);
    };
  }, []);

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate rotation based on mouse position relative to card center
    // Divide by larger values to make the rotation more subtle
    const rotateY = mouseX / 25;
    const rotateX = -mouseY / 25;

    setRotation({ x: rotateX, y: rotateY });
  };

  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      className={`relative w-full max-w-md mx-auto perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      <motion.div
        className="relative w-full h-full preserve-3d transition-transform duration-200"
        animate={{ 
          rotateX: rotation.x,
          rotateY: rotation.y,
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Card Front */}
        <div className="absolute inset-0 backface-hidden">
          <div className="h-full w-full rounded-xl overflow-hidden bg-gradient-to-br from-luxury-primary/10 via-luxury-darker to-luxury-accent/10 border border-luxury-primary/20 shadow-lg backdrop-blur-sm">
            {/* Card Header */}
            <div className="p-6 border-b border-luxury-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">EROXR</h3>
                  <p className="text-sm text-luxury-neutral/70">Premium Membership</p>
                </div>
                <div className="h-10 w-10">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-luxury-primary to-luxury-accent flex items-center justify-center">
                    <span className="text-white font-bold">EX</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              {/* Card Number */}
              <div className="mb-8">
                <p className="text-xs text-luxury-neutral/50 mb-1">Card Number</p>
                <div className="flex space-x-4 justify-between">
                  <p className="text-lg text-white font-mono">0616</p>
                  <p className="text-lg text-white font-mono">****</p>
                  <p className="text-lg text-white font-mono">****</p>
                  <p className="text-lg text-white font-mono">2025</p>
                </div>
              </div>

              {/* Card Holder */}
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-xs text-luxury-neutral/50 mb-1">Card Holder</p>
                  <p className="text-md text-white">PREMIUM MEMBER</p>
                </div>
                <div>
                  <p className="text-xs text-luxury-neutral/50 mb-1">Expires</p>
                  <p className="text-md text-white">∞/∞</p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-4 bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20">
              <div className="flex justify-between items-center">
                <p className="text-xs text-luxury-neutral/70">Unlimited Access</p>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-luxury-primary animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-luxury-accent animate-pulse delay-75"></div>
                  <div className="h-2 w-2 rounded-full bg-luxury-secondary animate-pulse delay-150"></div>
                </div>
              </div>
            </div>

            {/* Holographic effect */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-luxury-primary/0 via-luxury-primary/30 to-luxury-primary/0 pointer-events-none"></div>
            
            {/* Shine effect that follows mouse */}
            {isHovered && (
              <div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"
                style={{ 
                  transform: `rotate(${rotation.y / 2}deg)`,
                  opacity: isHovered ? 0.1 : 0 
                }}
              ></div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Card reflections and shadows */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-luxury-darker to-transparent opacity-50 rounded-b-xl"></div>
      
      {/* Surface reflection */}
      <div className="absolute -bottom-12 inset-x-0 h-12 bg-gradient-to-b from-luxury-primary/30 to-transparent blur-lg opacity-30 transform scale-75"></div>
    </div>
  );
};
