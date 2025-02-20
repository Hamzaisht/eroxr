
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { VideoPlayer } from "@/components/video/VideoPlayer";

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
    <div className="relative min-h-screen">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(13, 17, 23, 0.8), rgba(22, 27, 34, 0.9))'
      }} />
      
      {/* Background Video */}
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: -1 }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-luxury-dark" style={{ zIndex: -1 }} />
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
        <motion.div 
          initial={{
            opacity: 0,
            y: 20
          }} 
          animate={{
            opacity: 1,
            y: 0
          }} 
          transition={{
            duration: 0.8
          }} 
          className="text-center px-4 mt-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Empower Your Creative 
            <span className="text-luxury-primary"> Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-luxury-neutral max-w-2xl mb-8 mx-auto">
            Join our community of passionate creators and connect with like-minded individuals.
            Share your story, grow your audience, and monetize your content.
          </p>
          <motion.div 
            whileHover={{
              scale: 1.05
            }} 
            whileTap={{
              scale: 0.95
            }}
          >
            <Button size="lg" className="bg-gradient-to-r from-luxury-primary to-luxury-secondary text-white px-8 py-6 text-lg rounded-full">
              Get Started
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
