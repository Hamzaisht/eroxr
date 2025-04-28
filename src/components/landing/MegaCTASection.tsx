
import { useRef } from "react";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { MagneticButton } from "./components/MagneticButton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const MegaCTASection = () => {
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  return (
    <section className="relative py-24 px-4 sm:px-6">
      <div ref={ref} className="container mx-auto max-w-7xl">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background video */}
          <div className="absolute inset-0 -z-10">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            >
              <source src="https://cdn.pixabay.com/vimeo/328216459/11211.mp4?width=1280&hash=f634a0c30391633e01c1533bb0a01f7aec0a08d5" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-dark/95 via-luxury-darker/90 to-black/95" />
          </div>
          
          {/* Animated particle effects */}
          <div className="absolute inset-0 -z-10">
            <motion.div 
              className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-luxury-primary/10 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div 
              className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-luxury-accent/10 blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
            />
          </div>
          
          {/* Decorative grid */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 -z-10" />
          
          {/* Content container */}
          <div className="px-8 py-16 md:py-24 text-center">
            {/* Floating elements for visual interest */}
            <motion.div
              className="absolute -top-6 left-1/4 w-16 h-16 rounded-xl bg-luxury-primary/30 blur-md"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 15, 0],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
            <motion.div
              className="absolute bottom-10 right-1/4 w-12 h-12 rounded-full bg-luxury-accent/30 blur-md"
              animate={{ 
                y: [0, -10, 0],
                x: [0, 10, 0],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
            />
            
            {/* Headline */}
            <motion.h2
              className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-8 md:mb-10 text-center max-w-5xl mx-auto leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-white">Ready to </span>
              <span className="gradient-text">
                Grow Without Limits?
              </span>
            </motion.h2>
            
            {/* Subtext */}
            <motion.p 
              className="text-xl text-luxury-neutral/90 mb-10 md:mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Join thousands of creators already building their audience and earning on their terms.
              <span className="block mt-2 text-white font-medium">Your creative journey starts here.</span>
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Primary CTA */}
              <MagneticButton magneticStrength={1.2}>
                <Button 
                  asChild
                  className="text-xl py-8 px-12 rounded-xl bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary transition-all duration-500 relative overflow-hidden group shadow-button hover:shadow-button-hover"
                  size="lg"
                >
                  <Link to="/register" className="flex items-center font-display">
                    Join Eroxr
                    
                    {/* Animated pulse effect */}
                    <span className="absolute inset-0 rounded-md">
                      <span className="absolute inset-0 rounded-md bg-white opacity-0 group-hover:opacity-10 group-hover:animate-pulse-ring" />
                    </span>
                  </Link>
                </Button>
              </MagneticButton>
              
              {/* Secondary CTA */}
              <MagneticButton magneticStrength={0.8}>
                <Button 
                  asChild
                  variant="ghost"
                  size="lg"
                  className="text-lg font-display text-white border border-luxury-primary/30 hover:bg-luxury-primary/10"
                >
                  <Link to="/creators" className="flex items-center">
                    See What's Inside
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </MagneticButton>
            </motion.div>
            
            {/* Social proof */}
            <motion.div
              className="mt-12 flex flex-wrap justify-center items-center gap-8"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map(index => (
                  <div 
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-luxury-dark bg-gray-300 overflow-hidden"
                    style={{ 
                      background: `url(https://randomuser.me/api/portraits/men/${index + 30}.jpg)`,
                      backgroundSize: 'cover'
                    }}
                  />
                ))}
                <div className="w-8 h-8 rounded-full bg-luxury-primary flex items-center justify-center text-xs font-medium">
                  +99k
                </div>
              </div>
              <p className="text-sm text-luxury-neutral">
                <span className="text-white font-medium">10,000+ creators</span> joined in the last 30 days
              </p>
            </motion.div>
          </div>
          
          {/* Border glow effect */}
          <div className="absolute inset-0 rounded-3xl border border-luxury-primary/30 pointer-events-none">
            <motion.div 
              className="absolute inset-0 rounded-3xl border border-luxury-primary/0"
              animate={{
                boxShadow: [
                  '0 0 10px rgba(155,135,245,0.1)',
                  '0 0 20px rgba(155,135,245,0.2)',
                  '0 0 10px rgba(155,135,245,0.1)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
