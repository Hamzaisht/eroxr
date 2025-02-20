
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const RollingText = ({ children, href }: { children: string; href: string }) => {
  return (
    <Link 
      to={href} 
      className="group relative inline-block overflow-hidden px-4 py-2"
    >
      <span className="relative inline-block transition-transform duration-300 group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute left-0 inline-block translate-y-full transition-transform duration-300 group-hover:translate-y-0">
        {children}
      </span>
    </Link>
  );
};

export const Hero3D = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(13, 17, 23, 0)", "rgba(13, 17, 23, 0.95)"]
  );

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
      <motion.nav 
        style={{ backgroundColor: headerBg }}
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-200"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold text-white">
                Eroxr
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {["Explore", "Pricing", "Creators"].map((item) => (
                <RollingText key={item} href={`/${item.toLowerCase()}`}>
                  {item}
                </RollingText>
              ))}
              
              <Button 
                variant="ghost" 
                asChild 
                className="text-white hover:bg-white/10 transition-all duration-200"
              >
                <Link to="/login">Log In</Link>
              </Button>
              
              <Button 
                asChild 
                className="bg-luxury-primary hover:bg-luxury-primary/90 text-white transition-all duration-200"
              >
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Content */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Connect With Your Audience
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-luxury-neutral max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Join the platform where creators and fans connect through exclusive content, 
                live streams, and meaningful interactions.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button 
                  size="lg" 
                  className="bg-luxury-primary hover:bg-luxury-primary/90 text-white transition-all duration-200 px-8 py-6 text-lg w-full sm:w-auto"
                  asChild
                >
                  <Link to="/register">
                    Start Creating
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-luxury-neutral text-white hover:bg-white/10 transition-all duration-200 px-8 py-6 text-lg w-full sm:w-auto"
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
