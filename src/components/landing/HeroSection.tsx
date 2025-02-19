
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BackgroundEffects } from "./sections/BackgroundEffects";
import { HeroContent } from "./sections/HeroContent";
import { Hero3D } from "./Hero3D";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <BackgroundEffects />
      
      <div className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        <HeroContent />
        <Hero3D />
      </div>
    </section>
  );
};
