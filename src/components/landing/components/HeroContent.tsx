
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const HeroContent = () => {
  return (
    <motion.div 
      className="flex-1 text-center lg:text-left px-4 md:px-6 max-w-7xl mx-auto pt-20 lg:pt-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white via-luxury-primary to-luxury-accent bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Connect With Your Audience
      </motion.h1>
      
      <motion.p 
        className="text-lg sm:text-xl lg:text-2xl text-luxury-neutral mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0"
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
          size="lg"
          asChild 
          className="bg-luxury-primary hover:bg-luxury-primary/90 w-full sm:w-auto text-base sm:text-lg"
        >
          <Link to="/register">
            Start Creating
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button 
          size="lg"
          variant="outline" 
          asChild 
          className="w-full sm:w-auto text-base sm:text-lg"
        >
          <Link to="/about">
            Learn More
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
};
