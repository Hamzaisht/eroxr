
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const HeroContent = () => {
  return (
    <motion.div 
      className="w-full max-w-[800px] text-left"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-luxury-primary to-luxury-accent bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Connect With Your Audience
      </motion.h1>
      
      <motion.p 
        className="text-xl lg:text-2xl text-luxury-neutral mb-10 max-w-[600px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Join the platform where creators and fans connect through exclusive content, live streams, and meaningful interactions.
      </motion.p>

      <motion.div 
        className="flex flex-row items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button 
          size="lg"
          asChild 
          className="bg-luxury-primary hover:bg-luxury-primary/90 text-lg h-14 px-8"
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
          className="text-lg h-14 px-8"
        >
          <Link to="/about">
            Learn More
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
};
