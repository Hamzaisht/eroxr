
import { memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Hero3D } from "./Hero3D";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HeroNavigation } from "./components/HeroNavigation";
import { Button } from "@/components/ui/button";

export const HeroSection = memo(() => {
  const [ref, isInView] = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const y = useTransform(scrollY, [0, 300], [0, 100]);
  
  return (
    <section 
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ margin: 0, padding: 0 }}
    >
      {/* Hero background with 3D elements */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div 
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <Hero3D isActive={isInView} />
        </motion.div>
      </div>

      {/* Navigation */}
      <HeroNavigation headerBg={useTransform(scrollY, [0, 100], ["rgba(13, 17, 23, 0)", "rgba(13, 17, 23, 0.9)"])} />

      {/* Hero Content - Full screen, centered */}
      <motion.div 
        style={{ opacity, scale, y }}
        className="relative z-10 flex items-center justify-center min-h-screen w-full"
      >
        <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Text content */}
            <div className="text-center lg:text-left">
              {/* Animated trusted badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full border border-luxury-primary/20 bg-luxury-dark/30 backdrop-blur-sm mb-8"
              >
                <span className="text-sm sm:text-base font-medium bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
                  Join 10,000+ creators worldwide
                </span>
              </motion.div>

              {/* Main heading with gradient */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6"
              >
                <span className="block text-white mb-2">Connect With Your</span>
                <span className="bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent">
                  Audience
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg sm:text-xl text-luxury-neutral/80 mb-10 max-w-2xl mx-auto lg:mx-0"
              >
                Build your community through exclusive content, live streams, and meaningful interactions
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6"
              >
                <Button
                  className="w-full sm:w-auto px-8 py-6 bg-luxury-primary hover:bg-luxury-primary/90 text-white rounded-lg text-lg font-medium"
                  asChild
                >
                  <Link to="/register" className="flex items-center">
                    Start Creating
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>

                <Button
                  variant="outline" 
                  className="w-full sm:w-auto px-8 py-6 border border-luxury-neutral/20 hover:border-luxury-primary/30 rounded-lg text-lg font-medium"
                  asChild
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </motion.div>
            </div>

            {/* Right column - Visual content */}
            <div className="hidden lg:block">
              {/* Add any additional visual content here */}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
