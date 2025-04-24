
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { memo, useRef } from "react";
import { AnimatedGradientText } from "./AnimatedGradientText";
import { MagneticButton } from "./MagneticButton";

export const HeroContent = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  const textReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    })
  };

  return (
    <div className="w-full h-full px-0 lg:px-10">
      <motion.div 
        ref={containerRef}
        className="max-w-[1600px] mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="mb-4 flex items-center space-x-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="flex items-center px-3 py-1 rounded-full border border-luxury-primary/20"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Star className="h-3.5 w-3.5 text-luxury-primary mr-1.5" />
            <motion.span 
              className="text-sm font-medium text-luxury-neutral"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Trusted by 10,000+ creators worldwide
            </motion.span>
          </motion.div>
        </motion.div>
        
        <div className="relative">
          <motion.h1 
            custom={1}
            variants={textReveal}
            initial="hidden"
            animate="visible"
            className="text-6xl lg:text-8xl font-bold mb-8 relative z-10"
          >
            <AnimatedGradientText 
              text="Connect With Your"
              gradient="from-white to-white"
              className="block mb-3"
            />
            <AnimatedGradientText 
              text="Audience" 
              delay={0.5}
              gradient="from-luxury-primary to-luxury-accent"
              className="block"
            />
          </motion.h1>
          
          <motion.p 
            custom={2}
            variants={textReveal}
            initial="hidden"
            animate="visible"
            className="text-xl lg:text-2xl text-luxury-neutral mb-10 max-w-[600px]"
          >
            Join the platform where creators and fans connect through exclusive content, live streams, and meaningful interactions.
          </motion.p>
        </div>

        <motion.div 
          className="flex flex-row items-center gap-6"
          custom={3}
          variants={textReveal}
          initial="hidden"
          animate="visible"
        >
          <MagneticButton magneticStrength={0.5}>
            <Button 
              asChild 
              className="rounded-full text-lg h-14 px-8 font-semibold tracking-wider group bg-luxury-primary hover:bg-luxury-accent transition-colors duration-300" 
            >
              <Link to="/register" className="flex items-center justify-center">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </MagneticButton>
          
          <MagneticButton magneticStrength={0.3}>
            <Button 
              size="lg"
              variant="outline" 
              asChild 
              className="text-lg h-14 px-8 rounded-full border-luxury-neutral/20 hover:border-luxury-primary/30 transition-all duration-500"
            >
              <Link to="/about" className="flex items-center">
                Learn More
              </Link>
            </Button>
          </MagneticButton>
        </motion.div>
        
        <motion.div 
          className="mt-16 flex items-center gap-4"
          custom={4}
          variants={textReveal}
          initial="hidden"
          animate="visible"
        >
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i} 
                className="w-10 h-10 rounded-full border-2 border-luxury-dark bg-gray-200 overflow-hidden"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + (i * 0.1), duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.1, zIndex: 10 }}
              >
                <img 
                  src={`https://i.pravatar.cc/100?img=${i+10}`} 
                  alt="User avatar" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
          <motion.p 
            className="text-sm text-luxury-neutral/80"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <span className="font-semibold text-white">1,200+ creators</span> joined in the last month
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
});

HeroContent.displayName = "HeroContent";
