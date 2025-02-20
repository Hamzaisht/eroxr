
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useMemo } from "react";

const ParticleRing = () => {
  const count = 5000;
  const positions = useMemo(() => {
    const points = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = THREE.MathUtils.lerp(2, 3.5, Math.random());
      const y = THREE.MathUtils.lerp(-0.5, 0.5, Math.random());
      
      points.push(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      );
    }
    return new Float32Array(points);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#9b87f5"
        sizeAttenuation={true}
        transparent={true}
      />
    </points>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <ParticleRing />
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#1A1F2C"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
    </>
  );
};

export const Hero3D = () => {
  return (
    <div className="relative h-[600px] w-full">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        className="absolute inset-0"
      >
        <Scene />
      </Canvas>
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Connect with
            <span className="text-luxury-primary"> Creators</span>
          </h1>
          <p className="text-lg md:text-xl text-luxury-neutral max-w-2xl mb-8 mx-auto">
            Join our community of passionate creators and connect with like-minded individuals.
            Share your story, grow your audience, and monetize your content.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-luxury-primary to-luxury-secondary rounded-full text-white font-semibold text-lg"
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
