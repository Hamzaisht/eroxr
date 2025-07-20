import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MicroInteraction {
  id: string;
  type: 'hover' | 'click' | 'focus' | 'scroll';
  element: string;
  animation: any;
}

// Advanced Magnetic Button with Ripple Effect
export const MagneticButton = ({ 
  children, 
  className = "", 
  onClick,
  variant = "primary"
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
    );
    
    if (distance < 150) {
      const force = (150 - distance) / 150;
      x.set((e.clientX - centerX) * force * 0.3);
      y.set((e.clientY - centerY) * force * 0.3);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    
    const newRipple = { 
      id: Date.now(), 
      x: rippleX, 
      y: rippleY 
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    if (onClick) onClick();
  };

  const variantStyles = {
    primary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/25",
    secondary: "bg-gray-900/50 border border-white/20 text-white hover:bg-gray-800/50",
    ghost: "text-white hover:bg-white/10"
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      className={`
        relative overflow-hidden px-8 py-4 rounded-xl font-grotesk font-semibold
        transition-all duration-300 ${variantStyles[variant]} ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            x: '-50%',
            y: '-50%',
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
      
      {/* Hover Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

// Floating Action Button with Breathe Animation
export const FloatingActionButton = ({ 
  icon: Icon, 
  onClick, 
  position = "bottom-right",
  tooltip 
}: {
  icon: React.ComponentType<any>;
  onClick: () => void;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  tooltip?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const positionClasses = {
    "bottom-right": "bottom-8 right-8",
    "bottom-left": "bottom-8 left-8", 
    "top-right": "top-8 right-8",
    "top-left": "top-8 left-8"
  };

  return (
    <motion.div className={`fixed ${positionClasses[position]} z-50`}>
      <motion.button
        className="relative w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        animate={{
          boxShadow: [
            "0 0 20px rgba(139, 92, 246, 0.3)",
            "0 0 30px rgba(139, 92, 246, 0.6)",
            "0 0 20px rgba(139, 92, 246, 0.3)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon className="w-6 h-6" />
        
        {/* Pulse Ring */}
        <motion.div
          className="absolute inset-0 border-2 border-purple-400 rounded-full"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>
      
      {/* Tooltip */}
      {tooltip && (
        <motion.div
          className="absolute bottom-full mb-2 right-0 bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10
          }}
          transition={{ duration: 0.2 }}
        >
          {tooltip}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
        </motion.div>
      )}
    </motion.div>
  );
};

// Smooth Reveal on Scroll
export const ScrollReveal = ({ 
  children, 
  direction = "up",
  delay = 0,
  duration = 0.6 
}: {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const variants = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? -50 : direction === "right" ? 50 : 0,
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// Parallax Text Effect
export const ParallaxText = ({ 
  children, 
  speed = 0.5,
  className = "" 
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const ySmooth = useSpring(y, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const distance = e.clientY - centerY;
      
      y.set(distance * speed * 0.1);
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [speed, y]);

  return (
    <motion.div
      ref={ref}
      style={{ y: ySmooth }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Morphing Shape Background
export const MorphingShape = ({ 
  className = "",
  color = "purple"
}: {
  className?: string;
  color?: "purple" | "pink" | "blue";
}) => {
  const colors = {
    purple: "bg-purple-500/10",
    pink: "bg-pink-500/10", 
    blue: "bg-blue-500/10"
  };

  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${colors[color]} ${className}`}
      animate={{
        scale: [1, 1.2, 0.8, 1],
        rotate: [0, 90, 180, 270, 360],
        borderRadius: ["50%", "40%", "50%", "60%", "50%"]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};