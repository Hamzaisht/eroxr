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
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            >
              <source src="https://placehold.co/1920x1080.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-dark/90 via-luxury-darker/90 to-black/90" />
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
            {/* Headline */}
            <motion.h2
              className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 md:mb-10 text-center max-w-5xl mx-auto leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-white">Ready to </span>
              <span className="bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
                Grow Without Limits?
              </span>
            </motion.h2>
            
            {/* Subtext */}
            <motion.p 
              className="text-xl text-luxury-neutral mb-10 md:mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Join thousands of creators already building their audience and earning on their terms. Your creative journey starts here.
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
                  className="text-xl py-8 px-12 bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary transition-all duration-500 relative overflow-hidden group"
                  size="lg"
                >
                  <Link to="/register">
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
                  className="text-lg text-white border border-luxury-primary/30 hover:bg-luxury-primary/10"
                >
                  <Link to="/creators">
                    See What's Inside
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </MagneticButton>
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
