
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { Loader2, Heart, MessageSquare, Share2 } from "lucide-react";

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
        <Loader2 className="animate-spin h-10 w-10 text-luxury-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <motion.h1 
        className="text-4xl font-bold mb-6 bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Eros Platform
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Featured Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-luxury-primary/20 hover:border-luxury-primary/40 transition-all shadow-xl">
            <CardHeader className="p-4">
              <CardTitle>Featured Content</CardTitle>
              <CardDescription>Discover popular creators and their exclusive content</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <MediaRenderer 
                source="https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=1470&auto=format&fit=crop"
                className="w-full h-48 object-cover"
              />
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <div className="flex items-center gap-4">
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
              <Button size="sm">Explore</Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Live Streams Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-luxury-primary/20 hover:border-luxury-primary/40 transition-all shadow-xl">
            <CardHeader className="p-4">
              <CardTitle>Live Streams</CardTitle>
              <CardDescription>Watch live performances and interact with creators</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <MediaRenderer 
                source="https://images.unsplash.com/photo-1561089489-f13d5e730d72?q=80&w=1470&auto=format&fit=crop"
                className="w-full h-48 object-cover"
              />
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <div className="flex items-center gap-4">
                <span className="text-red-500 flex items-center text-sm">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5 animate-pulse"></span>
                  Live Now
                </span>
              </div>
              <Button size="sm">Watch</Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Premium Access Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-luxury-primary/20 hover:border-luxury-primary/40 transition-all shadow-xl">
            <CardHeader className="p-4">
              <CardTitle>Premium Access</CardTitle>
              <CardDescription>Unlock exclusive content with our premium subscription</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <MediaRenderer 
                source="https://images.unsplash.com/photo-1604076913837-52ab5629fba9?q=80&w=1470&auto=format&fit=crop"
                className="w-full h-48 object-cover"
              />
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">From $9.99/month</span>
              </div>
              <Button size="sm">Subscribe</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">Trending Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Photography', 'Fitness', 'Art', 'Music'].map((category) => (
            <Card key={category} className="overflow-hidden hover:scale-105 transition-transform">
              <CardContent className="p-4 text-center">
                <h3 className="font-medium">{category}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
