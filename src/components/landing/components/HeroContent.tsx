
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { memo } from "react";
import { GlowingStats } from "./GlowingStats";
import { GlowingButton } from "./GlowingButton";

export const HeroContent = memo(() => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-start text-left lg:max-w-[640px] py-8 sm:py-12 lg:py-16">
        {/* Animated trusted badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center px-4 py-2 rounded-full border border-luxury-primary/20 bg-luxury-dark/30 backdrop-blur-sm mb-8"
        >
          <span className="text-sm sm:text-base font-medium bg-gradient-to-r from-[#b563ff] to-luxury-accent bg-clip-text text-transparent">
            Built for Modern Creators
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
          <span className="bg-gradient-to-r from-[#b563ff] via-luxury-accent to-luxury-secondary bg-clip-text text-transparent">
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
          Monetize your content, connect deeper with fans, and grow your community on your terms
        </motion.p>

        {/* Stats counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-10"
        >
          <GlowingStats />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col w-full sm:flex-row items-center sm:items-start gap-4 sm:gap-6"
        >
          <GlowingButton 
            className="w-full sm:w-auto"
            glowColor="rgba(181, 99, 255, 0.7)"
            asChild
          >
            <Link to="/register" className="flex items-center justify-center">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </GlowingButton>

          <Button
            variant="outline" 
            className="w-full sm:w-auto px-8 py-6 border border-luxury-neutral/20 hover:border-[#b563ff]/30 rounded-full text-lg font-medium bg-transparent"
            asChild
          >
            <Link to="/explore" className="flex items-center justify-center">Explore Platform</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
});

HeroContent.displayName = "HeroContent";

export default HeroContent;
