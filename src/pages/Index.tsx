import { Hero } from "@/components/Hero";
import { FeaturedCreators } from "@/components/FeaturedCreators";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="container">
        <FeaturedCreators />
      </div>
    </div>
  );
};

export default Index;