
import { useRef } from "react";
import { motion, MotionValue } from "framer-motion";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/landing/components/MagneticButton";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Crown, Sparkles } from "lucide-react";
import CSSParticlesBackground from "./CSSParticlesBackground";
import { FloatingCreatorCards } from "./FloatingCreatorCards";

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
      y: 0
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
      {/* Dynamic Background Layers */}
      <CSSParticlesBackground />
      
      {/* Floating Creator Cards */}
      <FloatingCreatorCards />
      
      {/* Content container with parallax effect */}
      <motion.div 
        style={{ x, y }}
        className="relative z-20 w-full flex items-center justify-center"
      >
        <div className="w-full flex justify-center">
          <motion.div 
            className="text-center w-full max-w-[90rem] px-4 sm:px-6 lg:px-8 space-y-12"
            initial="hidden"
            animate="visible"
            variants={textVariants}
            transition={{ 
              duration: 0.8,
              staggerChildren: 0.3,
              ease: [0.22, 1, 0.36, 1]
            }}
            style={{ opacity: scrollOpacity }}
          >
            {/* Trust Badge */}
            <motion.div 
              className="flex items-center justify-center gap-3 mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20 backdrop-blur-xl border border-luxury-primary/30 rounded-full px-6 py-3">
                <Crown className="w-5 h-5 text-luxury-primary" />
                <span className="text-luxury-primary font-medium">Nordic's #1 Creator Platform</span>
                <Sparkles className="w-5 h-5 text-luxury-accent" />
              </div>
            </motion.div>

            {/* Main headline with enhanced typography */}
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-white via-luxury-primary to-luxury-accent bg-clip-text text-transparent leading-tight">
                Where Creators
              </span>
              <br />
              <span className="bg-gradient-to-r from-luxury-accent via-luxury-primary to-white bg-clip-text text-transparent">
                Earn & Fans Connect
              </span>
            </motion.h1>
            
            {/* Enhanced subheadline */}
            <motion.p 
              className="text-xl md:text-2xl lg:text-3xl text-slate-300 max-w-4xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Join <span className="text-luxury-primary font-bold">47,000+</span> creators earning an average of{" "}
              <span className="text-green-400 font-bold">$3,847/month</span> through authentic connections and premium content.
            </motion.p>
            
            {/* Enhanced CTA section */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16"
              variants={itemVariants}
            >
              <MagneticButton magneticStrength={0.7}>
                <Button 
                  asChild
                  size="lg" 
                  className="group text-lg py-8 px-12 bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary transition-all duration-500 shadow-lg shadow-luxury-primary/30 hover:shadow-luxury-accent/50 relative overflow-hidden"
                >
                  <Link to="/creator-signup" className="flex items-center">
                    <span className="relative z-10">Start Creating</span>
                    <Crown className="ml-3 h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-white/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  </Link>
                </Button>
              </MagneticButton>
              
              <MagneticButton magneticStrength={0.5}>
                <Button 
                  asChild
                  size="lg"
                  variant="outline" 
                  className="group text-lg py-8 px-12 text-white border-2 border-luxury-primary/50 hover:bg-luxury-primary/10 hover:border-luxury-primary transition-all duration-500 backdrop-blur-xl"
                >
                  <Link to="/features" className="flex items-center">
                    <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>Explore Platform</span>
                  </Link>
                </Button>
              </MagneticButton>
            </motion.div>

            {/* Social Proof Pills */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-4 mt-12 opacity-80"
              variants={itemVariants}
            >
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-full px-4 py-2 border border-slate-700/50">
                <span className="text-green-400 font-bold">$12.8M+</span>
                <span className="text-slate-400 ml-2">paid to creators</span>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-full px-4 py-2 border border-slate-700/50">
                <span className="text-blue-400 font-bold">890K+</span>
                <span className="text-slate-400 ml-2">content pieces</span>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-full px-4 py-2 border border-slate-700/50">
                <span className="text-purple-400 font-bold">234%</span>
                <span className="text-slate-400 ml-2">avg. growth</span>
              </div>
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
