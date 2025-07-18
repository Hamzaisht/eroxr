
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicHero } from "@/components/landing/CinematicHero";
import { CreatorMosaic } from "@/components/landing/CreatorMosaic";
import { ScrollProgress } from "@/components/landing/components/ScrollProgress";
import { useRef } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Navigation - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Scene 1: Cinematic Hero with Video Background */}
      <CinematicHero scrollYProgress={scrollYProgress} />

      {/* Scene 2: Creator Mosaic Grid */}
      <CreatorMosaic scrollYProgress={scrollYProgress} />
    </div>
  );
};

export default Landing;
