import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MetaTags } from "@/head/MetaTags";
import { ThreeDHeroNative } from "@/components/landing/cinematic/ThreeDHeroNative";
import { WhyEroxrExists } from "@/components/landing/cinematic/WhyEroxrExists";
import { CreatorShowcase } from "@/components/landing/cinematic/CreatorShowcase";
import { EarningsSection } from "@/components/landing/cinematic/EarningsSection";
import { HowItWorks } from "@/components/landing/cinematic/HowItWorks";
import { InteractivePlatformDemo } from "@/components/landing/cinematic/InteractivePlatformDemo";
import { StartYourPage } from "@/components/landing/cinematic/StartYourPage";
import { CinematicFooter } from "@/components/landing/cinematic/CinematicFooter";
import { ScrollProgress } from "@/components/landing/components/ScrollProgress";
import { LiveMarquee } from "@/components/landing/interactive/LiveMarquee";
import { RealTimeActivityFeed } from "@/components/landing/interactive/RealTimeActivityFeed";
import { FloatingActions } from "@/components/landing/interactive/FloatingActions";
import { PlatformMilestones } from "@/components/landing/interactive/PlatformMilestones";
import { TrustSafetySection } from "@/components/landing/cinematic/TrustSafetySection";
import { NavButtons } from "@/components/landing/NavButtons";
import { AnimatedBackground } from "@/components/landing/effects/AnimatedBackground";

const Landing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <>
      <MetaTags 
        title="EROXR - Premium Creator Platform | Content Revolution 2025"
        description="Enter the future of content creation. Premium creators, cinematic quality, revolutionary earnings. Own your content. Keep your earnings. Go premium."
        canonicalUrl="https://eroxr.se"
        ogImage="https://eroxr.se/og-image.png"
      />
      
      <div ref={containerRef} className="relative bg-black overflow-hidden">
        {/* Optimized Effects */}
        <AnimatedBackground />
        
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
        
        {/* Section 1: 3D Hero Native */}
        <ThreeDHeroNative scrollYProgress={scrollYProgress} />
        
        {/* Section 2: Why EROXR Exists */}
        <WhyEroxrExists scrollYProgress={scrollYProgress} />
        
        {/* Section 3: Creator Showcase Carousel */}
        <CreatorShowcase scrollYProgress={scrollYProgress} />
        
        {/* Section 4: Earnings Section */}
        <EarningsSection scrollYProgress={scrollYProgress} />
        
        {/* Section 5: How It Works */}
        <HowItWorks scrollYProgress={scrollYProgress} />
        
        {/* Section 6: Interactive Platform Demo */}
        <InteractivePlatformDemo scrollYProgress={scrollYProgress} />
        
        {/* Section 7: Trust & Safety */}
        <TrustSafetySection scrollYProgress={scrollYProgress} />
        
        {/* Section 8: Platform Milestones */}
        <PlatformMilestones />
        
        {/* Section 9: Start Your Page */}
        <StartYourPage scrollYProgress={scrollYProgress} />
        
        {/* Section 10: Footer */}
        <CinematicFooter />
      </div>
    </>
  );
};

export default Landing;