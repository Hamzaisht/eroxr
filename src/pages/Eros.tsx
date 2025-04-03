
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export default function Eros() {
  const session = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading content
    const timer = setTimeout(() => {
      setLoading(false);
      toast({
        title: "Welcome to Eros",
        description: "Experience our immersive content platform",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-luxury-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-luxury-dark min-h-screen">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
        Eros Platform
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Content cards */}
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-luxury-primary/20 hover:border-luxury-primary/40 transition-all shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Featured Content</h3>
          <p className="text-luxury-neutral/80">
            Discover our most popular creators and their exclusive content.
          </p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-luxury-primary/20 hover:border-luxury-primary/40 transition-all shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Live Streams</h3>
          <p className="text-luxury-neutral/80">
            Watch live performances and interact with your favorite creators.
          </p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-luxury-primary/20 hover:border-luxury-primary/40 transition-all shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Premium Access</h3>
          <p className="text-luxury-neutral/80">
            Unlock exclusive content with our premium subscription.
          </p>
        </div>
      </div>
    </div>
  );
}
