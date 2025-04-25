
import { useRef } from "react";
import { motion, MotionValue } from "framer-motion";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/landing/components/MagneticButton";
import { Link } from "react-router-dom";
import ParticlesBackground from "./ParticlesBackground";
import { ArrowRight, Plus } from "lucide-react";

interface HeroSectionProps {
  scrollOpacity?: MotionValue<number>;
}

export const HeroSection = ({ scrollOpacity }: HeroSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMouseParallax(0.1);
  
  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2,
        ease: "easeOut"
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-screen min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Particle background */}
      <ParticlesBackground />
      
      {/* Content container with parallax effect */}
      <motion.div 
        style={{ x, y }}
        className="relative z-10 w-full flex items-center justify-center"
      >
        <div className="w-full flex justify-center">
          <motion.div 
            className="text-center w-full max-w-[90rem] px-4 sm:px-6 lg:px-8 space-y-12"
            initial="hidden"
            animate="visible"
            variants={textVariants}
            style={{ opacity: scrollOpacity }}
          >
            {/* Main headline */}
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter bg-gradient-to-r from-luxury-neutral via-white to-luxury-neutral bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Unlock Your World of <br className="hidden sm:block" />Exclusive Content
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              className="text-xl md:text-2xl lg:text-3xl text-luxury-neutral/90"
              variants={itemVariants}
            >
              Where creators thrive and fans belong.
            </motion.p>
            
            {/* CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
              variants={itemVariants}
            >
              <MagneticButton magneticStrength={0.7}>
                <Button 
                  asChild
                  size="lg" 
                  className="text-lg py-7 px-10 bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary transition-all duration-500"
                >
                  <Link to="/register">
                    Join Now <Plus className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </MagneticButton>
              
              <MagneticButton magneticStrength={0.5}>
                <Button 
                  asChild
                  size="lg"
                  variant="ghost" 
                  className="text-lg py-7 px-10 text-white border border-luxury-primary/30 hover:bg-luxury-primary/10"
                >
                  <Link to="/creators">
                    Explore Creators <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ opacity: scrollOpacity }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-0.5 rounded bg-gradient-to-b from-luxury-primary to-transparent" />
          <p className="text-sm text-luxury-neutral uppercase tracking-widest">Scroll</p>
        </div>
      </motion.div>
    </section>
  );
};
