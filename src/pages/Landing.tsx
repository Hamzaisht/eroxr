
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
import { LiveStatsSection } from "@/components/landing/LiveStatsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex flex-col relative overflow-hidden">
      {/* Greek Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0 bg-repeat bg-[length:100px_100px]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 0L65 35L100 35L72.5 57.5L80 92.5L50 75L20 92.5L27.5 57.5L0 35L35 35Z" fill="#E5E7EB" opacity="0.3"/></svg>')}")`
          }}
        />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Live Stats Section */}
      <LiveStatsSection />

      {/* Interactive Demo Section */}
      <InteractiveDemo />

      {/* Enhanced Features Section */}
      <FeaturesSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
