
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import Footer from "@/components/landing/Footer";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-luxury-neutral max-w-2xl mx-auto">
              Connect, create, and share with a community that celebrates authenticity and creativity.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-luxury-darker border-luxury-neutral/10">
              <CardHeader>
                <CardTitle className="text-white">Create Content</CardTitle>
                <CardDescription>
                  Share your stories, photos, and videos with the world
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-luxury-darker border-luxury-neutral/10">
              <CardHeader>
                <CardTitle className="text-white">Connect</CardTitle>
                <CardDescription>
                  Build meaningful relationships with like-minded people
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-luxury-darker border-luxury-neutral/10">
              <CardHeader>
                <CardTitle className="text-white">Earn</CardTitle>
                <CardDescription>
                  Monetize your content and build your personal brand
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
