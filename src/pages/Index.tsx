import { Hero } from "@/components/Hero";
import { FeaturedCreators } from "@/components/FeaturedCreators";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <FeaturedCreators />
    </main>
  );
};

export default Index;