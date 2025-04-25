
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { memo } from "react";

export const HeroContent = memo(() => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start text-left max-w-3xl">
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
          className="text-lg sm:text-xl text-luxury-neutral/80 mb-10 max-w-2xl"
        >
          Build your community through exclusive content, live streams, and meaningful interactions
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6"
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
    </div>
  );
});

HeroContent.displayName = "HeroContent";

export default HeroContent;
