
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";

export const HeroContent = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  
  return (
    <motion.div 
      className="flex-1 text-center lg:text-left px-4 md:px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white via-luxury-primary to-luxury-accent bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Connect With Your Audience
      </motion.h1>
      
      <motion.p 
        className="text-base sm:text-lg md:text-xl text-luxury-neutral mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Join the platform where creators and fans connect through exclusive content, live streams, and meaningful interactions.
      </motion.p>

      <motion.div 
        className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button 
          size={isMobile ? "default" : "lg"} 
          asChild 
          className="bg-luxury-primary hover:bg-luxury-primary/90 w-full sm:w-auto"
        >
          <Link to="/register" className={`${isMobile ? 'text-base' : 'text-lg'}`}>
            Start Creating
            <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
          </Link>
        </Button>
        <Button 
          size={isMobile ? "default" : "lg"} 
          variant="outline" 
          asChild 
          className="w-full sm:w-auto"
        >
          <Link to="/about" className={`${isMobile ? 'text-base' : 'text-lg'}`}>
            Learn More
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
};
