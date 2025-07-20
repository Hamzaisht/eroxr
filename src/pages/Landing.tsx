import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MetaTags } from "@/head/MetaTags";
import { CinematicHero } from "@/components/landing/cinematic/CinematicHero";
import { WhyEroxrExists } from "@/components/landing/cinematic/WhyEroxrExists";
import { CreatorShowcase } from "@/components/landing/cinematic/CreatorShowcase";
import { EarningsSection } from "@/components/landing/cinematic/EarningsSection";
import { HowItWorks } from "@/components/landing/cinematic/HowItWorks";
import { LiveContentMagic } from "@/components/landing/cinematic/LiveContentMagic";
import { StartYourPage } from "@/components/landing/cinematic/StartYourPage";
import { CinematicFooter } from "@/components/landing/cinematic/CinematicFooter";
import { ScrollProgress } from "@/components/landing/components/ScrollProgress";
import { LiveMarquee } from "@/components/landing/interactive/LiveMarquee";
import { RealTimeActivityFeed } from "@/components/landing/interactive/RealTimeActivityFeed";
import { FloatingActions } from "@/components/landing/interactive/FloatingActions";
import { PlatformMilestones } from "@/components/landing/interactive/PlatformMilestones";
import { NavButtons } from "@/components/landing/NavButtons";

const Landing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <>
      <MetaTags 
        title="EROXR - Premium Creator Platform | Cinematic Adult Content Revolution"
        description="Enter the future of adult content creation. Premium creators, cinematic quality, revolutionary earnings. Own your content. Keep your earnings. Go premium."
        canonicalUrl="https://eroxr.se"
        ogImage="https://eroxr.se/og-image.png"
      />
      
      <div ref={containerRef} className="relative bg-black overflow-hidden">
        {/* Navigation Header */}
        <div className="fixed top-16 right-4 z-50 flex gap-3">
          <NavButtons />
        </div>
        
        {/* Live Marquee */}
        <LiveMarquee />
        
        {/* Real-time Activity Feed */}
        <RealTimeActivityFeed />
        
        {/* Floating Actions */}
        <FloatingActions />
        
        <ScrollProgress />
        
        {/* Section 1: Hero Cinematic Intro */}
        <CinematicHero scrollYProgress={scrollYProgress} />
        
        {/* Section 2: Why EROXR Exists */}
        <WhyEroxrExists scrollYProgress={scrollYProgress} />
        
        {/* Section 3: Creator Showcase Carousel */}
        <CreatorShowcase scrollYProgress={scrollYProgress} />
        
        {/* Section 4: Earnings Section */}
        <EarningsSection scrollYProgress={scrollYProgress} />
        
        {/* Section 5: How It Works */}
        <HowItWorks scrollYProgress={scrollYProgress} />
        
        {/* Section 6: Live Content & AI Magic */}
        <LiveContentMagic scrollYProgress={scrollYProgress} />
        
        {/* Section 7: Platform Milestones */}
        <PlatformMilestones />
        
        {/* Section 8: Start Your Page */}
        <StartYourPage scrollYProgress={scrollYProgress} />
        
        {/* Section 9: Footer */}
        <CinematicFooter />
      </div>
    </>
  );
};

export default Landing;