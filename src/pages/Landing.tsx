
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col">
      {/* Header */}
      <header className="p-6 border-b border-luxury-neutral/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Platform</h1>
          <Button 
            onClick={() => navigate("/login")}
            variant="outline"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white">
              Welcome to Our Platform
            </h2>
            <p className="text-xl text-luxury-neutral max-w-2xl mx-auto">
              Connect, create, and share with a community that celebrates authenticity and creativity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate("/login")}
              className="px-8 py-3"
            >
              Get Started
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="px-8 py-3"
            >
              Learn More
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
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
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-luxury-neutral/10">
        <div className="max-w-7xl mx-auto text-center text-luxury-neutral">
          <p>&copy; 2024 Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
