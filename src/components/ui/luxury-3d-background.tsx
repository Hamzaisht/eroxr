import { Canvas } from '@react-three/fiber';
import { Float, Text3D, Environment, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';

interface Luxury3DBackgroundProps {
  className?: string;
}

const FloatingOrb = ({ position, scale, color }: any) => (
  <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
    <Sphere args={[1, 64, 64]} position={position} scale={scale}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.1}
      />
    </Sphere>
  </Float>
);

export const Luxury3DBackground = ({ className = "" }: Luxury3DBackgroundProps) => {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Environment preset="night" />
        
        {/* Ambient lighting for luxury feel */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={0.3} />
        <pointLight position={[-10, -10, -5]} intensity={0.2} color="#8b5cf6" />
        <pointLight position={[10, -10, -5]} intensity={0.2} color="#06b6d4" />
        
        {/* Floating luxury orbs */}
        <FloatingOrb position={[-4, 2, -2]} scale={0.8} color="#8b5cf6" />
        <FloatingOrb position={[4, -2, -3]} scale={1.2} color="#06b6d4" />
        <FloatingOrb position={[-2, -3, -1]} scale={0.6} color="#ec4899" />
        <FloatingOrb position={[3, 3, -4]} scale={0.9} color="#10b981" />
        <FloatingOrb position={[0, 0, -5]} scale={1.5} color="#f59e0b" />
      </Canvas>
      
      {/* Luxury gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-black/95" />
      
      {/* Luxury mesh pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #8b5cf6 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #06b6d4 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}
      />
    </div>
  );
};