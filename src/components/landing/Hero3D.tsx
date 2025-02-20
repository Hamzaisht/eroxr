
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export const Hero3D = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      const { data: { publicUrl } } = supabase
        .storage
        .from('landing-videos')
        .getPublicUrl('background.mp4');
      
      if (publicUrl) {
        setVideoUrl(publicUrl);
      }
    };

    loadVideo();
  }, []);

  return (
    <>
      {/* Hero Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(13, 17, 23, 0.9), rgba(22, 27, 34, 0.95))'
      }} />
      
      {/* Background Video */}
      {videoUrl && (
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            playsInline
            muted
            loop
            className="w-full h-full object-cover"
            style={{ zIndex: -1 }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-luxury-dark/80 backdrop-blur-xl border-b border-luxury-primary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <motion.h1 
                className="eroxr-logo"
                whileHover={{ scale: 1.05 }}
              >
                Eroxr
              </motion.h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/explore" className="nav-item-liquid text-luxury-neutral hover:text-white transition-colors">
                Explore
              </Link>
              <Link to="/pricing" className="nav-item-liquid text-luxury-neutral hover:text-white transition-colors">
                Pricing
              </Link>
              <Link to="/creators" className="nav-item-liquid text-luxury-neutral hover:text-white transition-colors">
                Creators
              </Link>
              <Button variant="ghost" asChild className="nav-item-liquid">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary transition-all duration-500">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-luxury-primary to-luxury-accent bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Connect With Your Audience
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-luxury-neutral max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Join the platform where creators and fans connect through exclusive content, 
                live streams, and meaningful interactions.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary text-white px-8 py-6 text-lg rounded-full w-full sm:w-auto"
                  asChild
                >
                  <Link to="/register">
                    Start Creating
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="border border-luxury-neutral/20 hover:bg-luxury-primary/10 px-8 py-6 text-lg rounded-full w-full sm:w-auto"
                  asChild
                >
                  <Link to="/about">
                    Learn More
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};
