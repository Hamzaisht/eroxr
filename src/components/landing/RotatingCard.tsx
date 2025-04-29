
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useTexture, Environment } from "@react-three/drei";
import { Vector3, Mesh } from "three";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface RotatingCardProps {
  className?: string;
}

const Card = () => {
  // Reference to the mesh for animations
  const cardRef = useRef<Mesh>(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Load texture for the card - Remove leading slash for Vite compatibility
  const texture = useTexture("lovable-uploads/1f90ad99-0978-444d-8b83-555a2ae853b0.png");
  
  // Add error handling for texture loading
  useEffect(() => {
    if (texture) {
      console.log("Texture loaded successfully");
    } else {
      console.error("Failed to load texture");
    }
  }, [texture]);
  
  // Subtle oscillating hover effect
  const [hoverY, setHoverY] = useState(0);
  
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setHoverY((prev) => Math.sin(Date.now() * 0.001) * 0.05);
    }, 16);
    
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Handle card rotation animation
  useFrame(({ clock }) => {
    if (cardRef.current && !prefersReducedMotion) {
      // Rotate card slowly around Y axis
      cardRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      
      // Add subtle floating movement
      cardRef.current.position.y = hoverY;
    }
  });

  return (
    <mesh ref={cardRef} castShadow receiveShadow>
      {/* Card shape - using a thin box for the card */}
      <boxGeometry args={[4.5, 6, 0.05]} />
      
      {/* Materials for each face of the card */}
      <group>
        {/* Front face with texture */}
        <mesh position={[0, 0, 0.026]}>
          <planeGeometry args={[4.5, 6]} />
          <meshStandardMaterial 
            map={texture} 
            emissive="#7b68ee"
            emissiveIntensity={0.2}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
        
        {/* Back face with simpler design */}
        <mesh position={[0, 0, -0.026]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[4.5, 6]} />
          <meshStandardMaterial 
            color="#0e0e12"
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
        
        {/* Edge material */}
        <mesh>
          <boxGeometry args={[4.5, 6, 0.05]} />
          <meshStandardMaterial 
            color="#d68c45"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.2}
          />
        </mesh>
      </group>
      
      {/* Soft glow effect */}
      <pointLight
        position={[0, 0, 2]}
        intensity={1.5}
        color="#9b87f5"
        distance={5}
      />
    </mesh>
  );
};

// Simpler floor component
const Floor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial
        color="#000000"
        metalness={0.9}
        roughness={0.1}
        opacity={0.3}
        transparent
      />
    </mesh>
  );
};

export const RotatingCard: React.FC<RotatingCardProps> = ({ className }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReducedMotion = useReducedMotion();
  const [rendererReady, setRendererReady] = useState(false);
  
  useEffect(() => {
    console.log("RotatingCard component mounted");
    
    // Mark renderer as ready after a short delay
    const timer = setTimeout(() => {
      setRendererReady(true);
    }, 100);
    
    return () => {
      console.log("RotatingCard component unmounted");
      clearTimeout(timer);
    };
  }, []);

  // Use a simplified version for mobile or reduced motion
  if ((isMobile || prefersReducedMotion) && rendererReady) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className={`relative ${className}`}
      >
        <img 
          src="lovable-uploads/1f90ad99-0978-444d-8b83-555a2ae853b0.png" 
          alt="EROXR Card" 
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`w-full aspect-square ${className}`}
    >
      <Canvas shadows dpr={[1, Math.min(window.devicePixelRatio, 2)]}>
        {/* Scene lighting - simplified for performance */}
        <ambientLight intensity={0.4} />
        <spotLight 
          position={[0, 10, 10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={1} 
          castShadow 
          color="#ffffff" 
        />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.5} 
          color="#9b87f5" 
        />
        
        {/* Environment for reflections */}
        <Environment preset="night" />
        
        {/* Camera setup */}
        <PerspectiveCamera makeDefault position={[0, 0, 6.5]} fov={40} />
        
        {/* Scene content */}
        <Card />
        <Floor />
        
        {/* Background color */}
        <color attach="background" args={["#0D1117"]} />
      </Canvas>
    </motion.div>
  );
};
