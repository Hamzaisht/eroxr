
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicHero } from "@/components/landing/CinematicHero";
import { CreatorMosaic } from "@/components/landing/CreatorMosaic";
import { PricingSection } from "@/components/landing/PricingSection";
import { LiveFeedSection } from "@/components/landing/LiveFeedSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { JoinFunnelSection } from "@/components/landing/JoinFunnelSection";
import { WhyJoinSection } from "@/components/landing/WhyJoinSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { ScrollProgress } from "@/components/landing/components/ScrollProgress";
import { MobileOptimizations } from "@/components/landing/MobileOptimizations";
import { MetaTags } from "@/head/MetaTags";
import { useRef } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <>
      {/* SEO Meta Tags */}
      <MetaTags 
        title="EROXR - Premier Creator Platform | Join 50K+ Creators Earning $4.2M+ Monthly"
        description="Join Nordic's premier creator platform. 85% revenue share, instant payouts, global audience of 2.1M+ fans. Start earning in minutes with advanced creator tools and 24/7 support."
        canonicalUrl="https://eroxr.se"
        ogImage="https://eroxr.se/og-image.png"
      />
      
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

        {/* Scene 3: Pricing Tiers */}
        <PricingSection />

        {/* Scene 4: Live Feed Reel */}
        <LiveFeedSection />

        {/* Scene 5: Trust & Security Layer */}
        <TrustSection />

        {/* Scene 6: Testimonials */}
        <TestimonialsSection />

        {/* Scene 7: Join Now Funnel */}
        <JoinFunnelSection />

        {/* Additional Sections */}
        <WhyJoinSection />
        <SocialProofSection />
        <FAQSection />

        {/* Mobile Optimizations */}
        <MobileOptimizations />
      </div>
    </>
  );
};

export default Landing;
