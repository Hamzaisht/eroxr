
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useEffect, useState } from "react";

const ParticleRing = () => {
  const points = Array.from({ length: 5000 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = THREE.MathUtils.lerp(2, 3.5, Math.random());
    const y = THREE.MathUtils.lerp(-0.5, 0.5, Math.random());
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    );
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#9b87f5" sizeAttenuation transparent />
    </points>
  );
};

export const Hero3D = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative h-[600px] w-full">
      <Canvas className="absolute inset-0">
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
        <ParticleRing />
        <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#1A1F2C"
            metalness={0.7}
            roughness={0.2}
          />
        </Sphere>
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
