import { Hero } from "@/components/Hero";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { SplashScreen } from "@/components/SplashScreen";

const Index = () => {
  return (
    <main className="min-h-screen bg-black">
      <SplashScreen />
      <Hero />
      <FeaturedCreators />
    </main>
  );
};

export default Index;