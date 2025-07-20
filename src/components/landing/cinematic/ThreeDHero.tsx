import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ThreeDHeroProps {
  scrollYProgress: MotionValue<number>;
}

// Animated Neural Network Particles
function NeuralNetwork({ count = 5000 }) {
  const mesh = useRef<THREE.Points>(null);
  const [sphere] = useState(() => new Float32Array(count * 3));
  
  const positions = useMemo(() => {
    for (let i = 0; i < count; i++) {
      const distance = Math.sqrt(Math.random()) * 50;
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360);
      
      let x = distance * Math.sin(theta) * Math.cos(phi);
      let y = distance * Math.sin(theta) * Math.sin(phi);
      let z = distance * Math.cos(theta);
      
      sphere[i * 3] = x;
      sphere[i * 3 + 1] = y;
      sphere[i * 3 + 2] = z;
    }
    return sphere;
  }, [count, sphere]);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x -= delta / 10;
      mesh.current.rotation.y -= delta / 15;
      
      // Animate individual particles
      const positions = mesh.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + positions[i]) * 0.01;
      }
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={mesh} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.8}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

// Floating 3D EROXR Logo
function FloatingLogo() {
  const mesh = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.3;
      mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <group ref={mesh}>
        <Center>
          <Text3D
            font="/fonts/Inter_Bold.json"
            size={1.2}
            height={0.2}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
          >
            EROXR
            <meshStandardMaterial 
              color="#8b5cf6"
              emissive="#4c1d95"
              emissiveIntensity={0.3}
              metalness={0.8}
              roughness={0.2}
            />
          </Text3D>
        </Center>
      </group>
    </Float>
  );
}

// Dynamic Energy Orbs
function EnergyOrbs() {
  const orbs = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      position: [
        Math.cos((i / 8) * Math.PI * 2) * 8,
        Math.sin(i * 0.5) * 3,
        Math.sin((i / 8) * Math.PI * 2) * 8,
      ] as [number, number, number],
      color: i % 2 === 0 ? "#8b5cf6" : "#ec4899",
      scale: Math.random() * 0.5 + 0.5
    })), []
  );

  return (
    <>
      {orbs.map((orb, i) => (
        <Float key={i} speed={2 + i * 0.2} rotationIntensity={1} floatIntensity={3}>
          <Sphere position={orb.position} args={[orb.scale, 32, 32]}>
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </Sphere>
        </Float>
      ))}
    </>
  );
}

// Camera Controller
function CameraController({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const { camera } = useThree();
  
  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      camera.position.z = 10 + latest * 5;
      camera.rotation.x = latest * 0.1;
    });
  }, [camera, scrollYProgress]);
  
  return null;
}

export const ThreeDHero = ({ scrollYProgress }: ThreeDHeroProps) => {
  const [ref, inView] = useInView({ threshold: 0.1 });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ y, opacity }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.1} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#ec4899" />
          
          <NeuralNetwork />
          <FloatingLogo />
          <EnergyOrbs />
          <CameraController scrollYProgress={scrollYProgress} />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-black mb-8">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              The Future
            </span>
            <br />
            <span className="text-white font-grotesk">of Creation</span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-white/80 font-grotesk font-light leading-relaxed max-w-4xl mx-auto mb-12">
            Where premium creators meet their most dedicated fans. 
            <br className="hidden md:block" />
            <span className="font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              85% revenue share. Instant payouts. Complete creative freedom.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full text-lg font-grotesk tracking-wide hover:shadow-2xl transition-all duration-300"
            >
              Start Creating Today
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 border border-white/30 text-white font-semibold rounded-full text-lg font-grotesk tracking-wide hover:bg-white/10 transition-all duration-300"
            >
              Explore Creators
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-2 bg-white/60 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
};