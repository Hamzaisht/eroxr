import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ThreeDHeroNativeProps {
  scrollYProgress: MotionValue<number>;
}

export const ThreeDHeroNative = ({ scrollYProgress }: ThreeDHeroNativeProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({ threshold: 0.1 });
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    logo: THREE.Group;
    orbs: THREE.Group[];
    animationId: number;
  } | null>(null);

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0x8b5cf6, 0.5);
    pointLight1.position.set(-10, -10, -10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xec4899, 0.5);
    pointLight2.position.set(10, 10, 10);
    scene.add(pointLight2);

    // Neural Network Particles
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const distance = Math.sqrt(Math.random()) * 50;
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360);
      
      positions[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = distance * Math.cos(theta);
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x8b5cf6,
      size: 0.8,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.rotation.set(0, 0, Math.PI / 4);
    scene.add(particles);

    // 3D Text Logo (using TextGeometry alternative - Box for now)
    const logoGroup = new THREE.Group();
    
    // Create EROXR letters as boxes (simplified for compatibility)
    const letterMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.2
    });
    
    const letterGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.2);
    const letterSpacing = 1.0;
    
    for (let i = 0; i < 5; i++) { // EROXR = 5 letters
      const letter = new THREE.Mesh(letterGeometry, letterMaterial);
      letter.position.x = (i - 2) * letterSpacing;
      logoGroup.add(letter);
    }
    
    logoGroup.position.set(0, 0, 0);
    scene.add(logoGroup);

    // Energy Orbs
    const orbs: THREE.Group[] = [];
    for (let i = 0; i < 8; i++) {
      const orbGroup = new THREE.Group();
      const orbGeometry = new THREE.SphereGeometry(Math.random() * 0.5 + 0.5, 32, 32);
      const orbMaterial = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x8b5cf6 : 0xec4899,
        emissive: i % 2 === 0 ? 0x8b5cf6 : 0xec4899,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
      });
      
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(
        Math.cos((i / 8) * Math.PI * 2) * 8,
        Math.sin(i * 0.5) * 3,
        Math.sin((i / 8) * Math.PI * 2) * 8
      );
      
      orbGroup.add(orb);
      scene.add(orbGroup);
      orbs.push(orbGroup);
    }

    // Camera position
    camera.position.z = 10;

    // Animation loop
    const clock = new THREE.Clock();
    let animationId: number;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate particles
      particles.rotation.x -= 0.001;
      particles.rotation.y -= 0.0015;
      
      // Animate particle positions
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(elapsedTime + positions[i]) * 0.01;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Animate logo
      logoGroup.rotation.y = elapsedTime * 0.3;
      logoGroup.position.y = Math.sin(elapsedTime * 0.5) * 0.5;

      // Animate orbs
      orbs.forEach((orb, i) => {
        orb.position.y += Math.sin(elapsedTime * (2 + i * 0.2)) * 0.01;
        orb.rotation.x += 0.01;
        orb.rotation.y += 0.015;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Store refs for cleanup and scroll control
    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles,
      logo: logoGroup,
      orbs,
      animationId
    };

    // Handle resize
    const handleResize = () => {
      if (!sceneRef.current) return;
      
      const { camera, renderer } = sceneRef.current;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
        if (mountRef.current && sceneRef.current.renderer.domElement) {
          mountRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, []);

  // Handle scroll-based camera movement
  useEffect(() => {
    if (!sceneRef.current) return;

    const unsubscribe = scrollYProgress.onChange((latest) => {
      if (sceneRef.current) {
        sceneRef.current.camera.position.z = 10 + latest * 5;
        sceneRef.current.camera.rotation.x = latest * 0.1;
      }
    });

    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <motion.section
      ref={ref}
      style={{ y, opacity }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* 3D Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

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