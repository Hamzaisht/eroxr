import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Star } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const HeroSection = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const handleGetStarted = () => {
    navigate("/login");
    toast({
      title: "Welcome!",
      description: "Let's start your creator journey together.",
    });
  };

  const handleWatchDemo = () => {
    // Scroll to demo section or play demo video
    toast({
      title: "Coming Soon!",
      description: "Our demo video will be available shortly.",
    });
  };

  return (
    <section
      ref={ref}
      className="min-h-screen relative flex items-center justify-center overflow-hidden bg-luxury-dark py-20 lg:py-32"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-luxury-primary/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-luxury-secondary/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          style={{ y, opacity }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <Sparkles className="w-6 h-6 text-luxury-primary animate-pulse" />
            <span className="text-luxury-primary font-semibold">Join thousands of successful creators</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-luxury-neutral to-luxury-primary bg-clip-text text-transparent">
              Transform Your Passion Into
            </span>
            <br />
            <span className="bg-gradient-to-r from-luxury-primary to-luxury-secondary bg-clip-text text-transparent">
              A Thriving Empire
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-luxury-neutral/80 mb-8 max-w-2xl mx-auto"
          >
            Join the revolution of creators who are building their dreams, connecting with passionate fans, 
            and earning from what they love. Your success story starts here!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-button-gradient hover:bg-hover-gradient text-white group relative overflow-hidden transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center">
                Start Creating Now
                <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.5, opacity: 0.4 }}
                transition={{ duration: 0.5 }}
              />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleWatchDemo}
              className="border-luxury-neutral text-luxury-neutral hover:bg-luxury-neutral/10 group"
            >
              <Star className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform" />
              Watch Success Stories
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 flex items-center justify-center gap-8 text-luxury-neutral/60"
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-luxury-primary" />
              <span>50K+ Creators</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-luxury-primary" />
              <span>$10M+ Earned</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-luxury-primary" />
              <span>1M+ Happy Fans</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};