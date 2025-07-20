import { motion, useTransform, MotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TypewriterText } from "../effects/TypewriterText";
import { MagneticButton } from "../interactive/MagneticButton";

interface CinematicHeroProps {
  scrollYProgress: MotionValue<number>;
}

export const CinematicHero = ({ scrollYProgress }: CinematicHeroProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax transforms
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 30, y: y * 30 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      ref={heroRef}
      style={{ y, opacity }}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Cinematic Background with Neural Network */}
      <motion.div 
        style={{ scale }}
        className="absolute inset-0"
      >
        {/* Neural Network Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/30 to-pink-950/20" />
        
        {/* Optimized Particle Field */}
        <div className="absolute inset-0 opacity-50">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                background: `hsl(${271 + Math.random() * 30}, 90%, ${65 + Math.random() * 15}%)`,
                filter: 'blur(0.5px)',
              }}
              animate={{
                y: [0, -20 - Math.random() * 15, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        {/* Simplified Light Orbs */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute rounded-full opacity-20"
              style={{
                left: `${25 + i * 25}%`,
                top: `${35 + Math.random() * 30}%`,
                width: 80 + Math.random() * 40,
                height: 80 + Math.random() * 40,
                background: `radial-gradient(circle, hsl(${271 + i * 15}, 90%, 70%) 0%, transparent 60%)`,
                filter: 'blur(20px)',
              }}
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                delay: i * 1.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/70" />
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, black 90%)'
          }}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 text-center max-w-6xl mx-auto px-6"
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
      >
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-300 bg-clip-text text-transparent">
            EROXR
          </h1>
        </motion.div>

        {/* Cinematic Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mb-12"
        >
          <motion.div 
            className="text-2xl md:text-4xl text-white/90 font-light leading-relaxed"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <TypewriterText
              texts={[
                "Cinematic. Provocative. Yours.",
                "Premium Content Creation.",
                "Revolutionary Earnings Model.",
                "The Future of Adult Content."
              ]}
              speed={60}
              delay={1500}
              className="text-2xl md:text-4xl font-light"
            />
          </motion.div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.5 }}
        >
          <MagneticButton
            strength={0.4}
            onClick={() => scrollToSection('why-eroxr')}
            className="px-12 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 border border-primary/30 rounded-full text-white"
            style={{
              boxShadow: 'var(--glow-primary), 0 0 30px rgba(139, 92, 246, 0.3)',
            }}
          >
            <span className="relative z-10 tracking-wide">Enter EROXR</span>
          </MagneticButton>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 3 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-white/60"
          >
            <span className="text-sm mb-2 tracking-wider">Experience More</span>
            <div className="w-0.5 h-8 bg-gradient-to-b from-pink-400 to-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};