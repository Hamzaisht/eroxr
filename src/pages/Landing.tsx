
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MetaTags } from "@/head/MetaTags";
import { Interactive3DHero } from "@/components/landing/3d/Interactive3DHero";
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
import { TopCreatorsShowcase } from "@/components/landing/cinematic/TopCreatorsShowcase";
import { NavButtons } from "@/components/landing/NavButtons";
import { AnimatedBackground } from "@/components/landing/effects/AnimatedBackground";

const Landing = () => {
  console.log('🏠 Landing page rendering...');
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  console.log('🏠 Landing page refs and hooks initialized');

  return (
    <>
      <MetaTags 
        title="EROXR - Premium Creator Platform | Content Revolution 2025"
        description="Enter the future of content creation. Premium creators, cinematic quality, revolutionary earnings. Own your content. Keep your earnings. Go premium."
        canonicalUrl="https://eroxr.se"
        ogImage="https://eroxr.se/og-image.png"
      />
      
      <div ref={containerRef} className="relative bg-black overflow-hidden">
        {/* Simplified Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        
        {/* Navigation Header */}
        <div className="fixed top-16 right-4 z-50 flex gap-3">
          <NavButtons />
        </div>
        
        {/* Live Marquee - Conditional Loading */}
        <div className="relative z-10">
          <LiveMarquee />
        </div>
        
        {/* Real-time Activity Feed - Conditional Loading */}
        <div className="fixed bottom-8 left-4 z-30 opacity-70 hover:opacity-100 transition-opacity">
          <RealTimeActivityFeed />
        </div>
        
        {/* Floating Actions - Conditional Loading */}
        <div className="relative z-20">
          <FloatingActions />
        </div>
        
        <ScrollProgress />
        
        {/* Section 1: Interactive 3D Hero - Wrapped in error boundary */}
        <div className="relative z-10">
          <Interactive3DHero scrollYProgress={scrollYProgress} />
        </div>
        
        {/* Section 2: Why EROXR Exists - Conditional Loading */}
        <div className="relative z-10">
          <WhyEroxrExists scrollYProgress={scrollYProgress} />
        </div>
        
        {/* Section 3: Creator Showcase Carousel - Conditional Loading */}
        <div className="relative z-10">
          <CreatorShowcase scrollYProgress={scrollYProgress} />
        </div>
        
        {/* Section 4: Top Creators Showcase - Conditional Loading */}
        <div className="relative z-10">
          <TopCreatorsShowcase scrollYProgress={scrollYProgress} />
        </div>
        
        {/* Section 5: Earnings Section - Conditional Loading */}
        <div className="relative z-10">
          <EarningsSection scrollYProgress={scrollYProgress} />
        </div>
        
        {/* Section 6: How It Works - Conditional Loading */}
        <div className="relative z-10">
          <HowItWorks scrollYProgress={scrollYProgress} />
        </div>
        
        {/* Section 7: Interactive Platform Demo - Conditional Loading */}
        <div className="relative z-10">
          <InteractivePlatformDemo scrollYProgress={scrollYProgress} />
        </div>
        
        {/* Section 8: Trust & Safety - Conditional Loading */}
        <div className="relative z-10">
          <TrustSafetySection scrollYProgress={scrollYProgress} />
        </div>
        
        {/* Section 9: Platform Milestones - Conditional Loading */}
        <div className="relative z-10">
          <PlatformMilestones />
        </div>
        
        {/* Section 10: Start Your Page - Conditional Loading */}
        <div className="relative z-10">
          <StartYourPage scrollYProgress={scrollYProgress} />
        </div>
        
        {/* Section 11: Footer - Conditional Loading */}
        <div className="relative z-10">
          <CinematicFooter />
        </div>
      </div>
    </>
  );
};

export default Landing;
