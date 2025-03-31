
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const HeroContent = () => {
  return (
    <motion.div 
      className="flex-1 text-center lg:text-left pt-32 px-4 md:px-8 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-luxury-primary to-luxury-accent bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Turn Your Passion Into Profit
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl text-luxury-neutral mb-8 max-w-2xl mx-auto lg:mx-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Join thousands of creators earning $5,000+ monthly through exclusive content and direct fan connections.
      </motion.p>

      <motion.div 
        className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button size="lg" asChild className="bg-luxury-primary hover:bg-luxury-primary/90 min-w-[200px]">
          <Link to="/register" className="text-lg">
            Start Creating - It's Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="min-w-[200px]">
          <Link to="/creators" className="text-lg">
            Explore Top Creators
          </Link>
        </Button>
      </motion.div>

      <motion.div 
        className="flex justify-center lg:justify-start gap-8 text-luxury-neutral/80 text-sm md:text-base flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
          <span>50,000+ Active Creators</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
          <span>2M+ Monthly Users</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
          <span>95% Creator Satisfaction</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
