import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

const FeatureBox = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#9b87f5"
        metalness={0.7}
        roughness={0.2}
      />
    </mesh>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <FeatureBox />
    </>
  );
};

const FeatureCard = ({ title, description, index }: { title: string; description: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    className="bg-luxury-dark/50 backdrop-blur-lg rounded-xl p-6 flex flex-col items-center text-center"
  >
    <div className="h-40 w-40 relative mb-6">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls 
            enableZoom={false}
            autoRotate
            autoRotateSpeed={4}
          />
        </Suspense>
      </Canvas>
    </div>
    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
    <p className="text-luxury-neutral">{description}</p>
  </motion.div>
);

export const Features3D = () => {
  const features = [
    {
      title: "Connect",
      description: "Build meaningful connections with creators and fans who share your interests.",
    },
    {
      title: "Create",
      description: "Share your unique content and stories with a supportive community.",
    },
    {
      title: "Grow",
      description: "Expand your reach and build a sustainable creative business.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-luxury-dark to-luxury-dark/95">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center text-white mb-16"
        >
          Why Choose Us
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};