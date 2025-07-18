import { motion, MotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, Crown, ArrowRight } from "lucide-react";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";
import { useRef } from "react";

interface CinematicHeroProps {
  scrollYProgress: MotionValue<number>;
}

export const CinematicHero = ({ scrollYProgress }: CinematicHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x: mouseX, y: mouseY } = useMouseParallax(0.02);
  
  // Parallax transforms based on scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  
  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Video Background with Dark Overlay */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ scale, opacity }}
      >
        {/* Video Background Placeholder - Replace with actual video */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-black opacity-90" />
        
        {/* Animated Background Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 h-full flex items-center justify-center px-4"
        style={{ x: mouseX, y: mouseY }}
      >
        <div className="text-center max-w-6xl mx-auto">
          {/* Trust Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">Nordic's Premier Creator Platform</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <span className="block bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Create.
            </span>
            <span className="block bg-gradient-to-r from-pink-300 via-purple-300 to-white bg-clip-text text-transparent">
              Connect.
            </span>
            <span className="block text-white">
              Earn.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Where creators build empires and fans discover their obsessions.
            <br />
            <span className="text-purple-300">Join 50,000+ creators earning $4.2M+ monthly.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button 
              asChild
              size="lg" 
              className="group text-lg py-8 px-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-500 shadow-2xl shadow-purple-500/30 hover:shadow-purple-400/50 relative overflow-hidden border-0"
            >
              <Link to="/creator-signup" className="flex items-center">
                <span className="relative z-10">Join the Experience</span>
                <Crown className="ml-3 h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-white/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              </Link>
            </Button>
            
            <Button 
              asChild
              size="lg"
              variant="outline" 
              className="group text-lg py-8 px-12 text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/60 transition-all duration-500 backdrop-blur-xl"
            >
              <Link to="/explore" className="flex items-center">
                <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Explore Creators</span>
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-8 mt-16 opacity-80"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Creators</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">$4.2M+</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Monthly Earnings</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">2.1M+</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Active Fans</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ opacity }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
          <span className="text-white/70 text-sm uppercase tracking-widest">Scroll</span>
        </div>
      </motion.div>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/80" />
      </div>
    </section>
  );
};