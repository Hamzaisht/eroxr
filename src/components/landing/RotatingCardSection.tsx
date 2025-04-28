
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RotatingCard } from "./RotatingCard";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export const RotatingCardSection = () => {
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.4]);
  
  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 bg-luxury-darker overflow-hidden"
    >
      <div ref={ref} className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ y }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Join the </span>
              <span className="bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
                Future
              </span>
            </h2>
            <p className="text-luxury-neutral text-lg mb-8">
              Become part of the exclusive community that's redefining social media. 
              EROXR provides a premium platform for content creators and fans to connect.
            </p>
            
            {/* Stats display */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="text-center p-4 backdrop-blur-sm bg-luxury-primary/10 rounded-lg border border-luxury-primary/20">
                <p className="text-2xl md:text-3xl font-bold text-luxury-primary">#0616</p>
                <p className="text-luxury-neutral/70 text-sm mt-1">Card Number</p>
              </div>
              <div className="text-center p-4 backdrop-blur-sm bg-luxury-accent/10 rounded-lg border border-luxury-accent/20">
                <p className="text-2xl md:text-3xl font-bold text-luxury-accent">296.7M</p>
                <p className="text-luxury-neutral/70 text-sm mt-1">SEK Value</p>
              </div>
              <div className="text-center p-4 backdrop-blur-sm bg-luxury-primary/10 rounded-lg border border-luxury-primary/20">
                <p className="text-2xl md:text-3xl font-bold text-luxury-primary">2025</p>
                <p className="text-luxury-neutral/70 text-sm mt-1">Est. Year</p>
              </div>
            </div>
          </motion.div>
          
          {/* Right side: Rotating card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ opacity }}
            className="relative"
          >
            {/* Glowing background effect */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-luxury-primary/20 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 w-80 h-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-luxury-accent/20 blur-3xl" />
            </div>
            
            <RotatingCard className="mx-auto max-w-md" />
            
            {/* Card description */}
            <div className="text-center mt-6">
              <p className="text-luxury-neutral/80 text-sm">
                THE SOCIAL MEDIA FOR ADULTS
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-luxury-primary/10 blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-luxury-accent/10 blur-3xl -z-10" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 -z-10" />
    </section>
  );
};
