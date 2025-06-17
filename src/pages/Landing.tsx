
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
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

      {/* Features Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              Why Choose Our Divine Platform?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Connect, create, and share with a community that celebrates authenticity and creativity.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/30 backdrop-blur-xl border-slate-700/30 hover:border-slate-600/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-slate-100">Create Divine Content</CardTitle>
                <CardDescription className="text-slate-400">
                  Share your stories, photos, and videos with the celestial community
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-slate-800/30 backdrop-blur-xl border-slate-700/30 hover:border-slate-600/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-slate-100">Connect with Creators</CardTitle>
                <CardDescription className="text-slate-400">
                  Build meaningful relationships with like-minded divine souls
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-slate-800/30 backdrop-blur-xl border-slate-700/30 hover:border-slate-600/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-slate-100">Monetize Your Art</CardTitle>
                <CardDescription className="text-slate-400">
                  Turn your divine creations into celestial rewards
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
