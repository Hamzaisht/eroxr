
import { motion } from "framer-motion";

export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating Geometric Elements */}
      <motion.div
        className="absolute top-[15%] right-[10%] w-16 h-16 border border-luxury-primary/30 rounded-full"
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 180],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-[20%] left-[15%] w-12 h-12 border-2 border-luxury-accent/20 rounded-lg"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, 60],
          scale: [1, 0.9, 1]
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div
        className="absolute bottom-[25%] left-[20%] w-24 h-4 bg-gradient-to-r from-luxury-primary/10 to-luxury-accent/10 rounded-full blur-sm"
        animate={{ 
          x: [0, 30, 0],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <motion.div
        className="absolute bottom-[30%] right-[25%] w-8 h-8 bg-gradient-to-r from-luxury-accent/20 to-luxury-primary/20 rounded-md blur-sm"
        animate={{ 
          y: [0, -25, 0],
          rotate: [0, 90],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ 
          duration: 14, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      
      {/* Glowing dots */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute rounded-full bg-luxury-primary/30 blur-sm"
          style={{
            width: Math.random() * 8 + 2 + 'px',
            height: Math.random() * 8 + 2 + 'px',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: Math.random() * 5 + 3, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};
