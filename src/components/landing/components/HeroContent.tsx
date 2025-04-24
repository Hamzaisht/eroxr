import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import { GlowingButton } from "./GlowingButton";
import { AnimatedText } from "./AnimatedText";

export const HeroContent = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="w-full max-w-[800px] text-left"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-2 flex items-center space-x-2">
        <div className="flex items-center px-3 py-1 rounded-full bg-luxury-primary/10 border border-luxury-primary/20">
          <Star className="h-3.5 w-3.5 text-luxury-primary mr-1.5" />
          <span className="text-sm font-medium text-luxury-neutral">
            Trusted by 10,000+ creators worldwide
          </span>
        </div>
      </div>
      
      <motion.h1 
        className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 bg-clip-text text-transparent relative z-10"
        style={{
          backgroundImage: 'linear-gradient(135deg, #fff 0%, rgba(155, 135, 245, 0.8) 50%, rgba(217, 70, 239, 0.8) 100%)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatedText text="Connect With Your" />
        <AnimatedText text="Audience" delay={0.5} className="bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent" />
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
        <GlowingButton 
          asChild 
          className="rounded-full text-lg h-14 px-8 font-semibold tracking-wider group" 
        >
          <Link to="/register" className="flex items-center justify-center">
            Start Creating
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </GlowingButton>
        
        <Button 
          size="lg"
          variant="outline" 
          asChild 
          className="text-lg h-14 px-8 rounded-full backdrop-blur-sm border-luxury-neutral/20 bg-luxury-dark/40 hover:bg-luxury-primary/10 hover:border-luxury-primary/30 transition-all duration-500"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/about" className="flex items-center">
              Learn More
            </Link>
          </motion.div>
        </Button>
      </motion.div>
      
      <motion.div 
        className="mt-12 flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-luxury-dark bg-gray-200 overflow-hidden">
              <img 
                src={`https://i.pravatar.cc/100?img=${i+10}`} 
                alt="User avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <p className="text-sm text-luxury-neutral/80">
          <span className="font-semibold text-white">1,200+ creators</span> joined in the last month
        </p>
      </motion.div>
    </motion.div>
  );
};
