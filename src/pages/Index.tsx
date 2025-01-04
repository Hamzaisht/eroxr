import { MainNav } from "@/components/MainNav";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { TrendingCreators } from "@/components/TrendingCreators";
import { PromotedAds } from "@/components/PromotedAds";
import { FeaturedCreators } from "@/components/FeaturedCreators";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main>
        <HeroSection />
        <CategorySection />
        <TrendingCreators />
        <FeaturedCreators />
        <PromotedAds />
      </main>
    </div>
  );
};

export default Index;