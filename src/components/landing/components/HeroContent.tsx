
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { memo, useRef } from "react";

export const HeroContent = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full h-full">
      <motion.div 
        ref={containerRef}
        className="w-full max-w-[1200px] mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Trusted badge */}
        <motion.div 
          className="mb-6 sm:mb-8 flex items-center justify-center lg:justify-start"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="inline-flex items-center px-4 py-2 rounded-full border border-luxury-primary/20"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Star className="h-4 w-4 text-luxury-primary mr-2" />
            <span className="text-sm sm:text-base font-medium text-luxury-neutral">
              Trusted by 10,000+ creators worldwide
            </span>
          </motion.div>
        </motion.div>
        
        {/* Main content */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8">
            <span className="block text-white mb-2">Connect With Your</span>
            <span className="bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Audience
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-luxury-neutral/80 mb-8 sm:mb-10 max-w-[600px] mx-auto lg:mx-0">
            Join the platform where creators and fans connect through exclusive content, 
            live streams, and meaningful interactions.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
            <Button 
              size="lg" 
              asChild
              className="w-full sm:w-auto text-lg px-8 py-6 bg-luxury-primary hover:bg-luxury-accent transition-colors duration-300"
            >
              <Link to="/register" className="flex items-center justify-center">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button 
              size="lg"
              variant="outline" 
              asChild 
              className="w-full sm:w-auto text-lg px-8 py-6 border-luxury-neutral/20 hover:border-luxury-primary/30"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

HeroContent.displayName = "HeroContent";
