
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export const Hero3D = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]
  );
  const headerTextColor = useTransform(
    scrollY,
    [0, 100],
    ["rgb(255, 255, 255)", "rgb(0, 0, 0)"]
  );
  const headerBorderColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0.1)", "rgba(0, 0, 0, 0.1)"]
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
        style={{ 
          backgroundColor: headerBg,
          color: headerTextColor,
          borderColor: headerBorderColor
        }}
        className="fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-200"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <motion.h1 
                className="text-3xl font-bold"
                style={{ color: headerTextColor }}
                whileHover={{ scale: 1.05 }}
              >
                Eroxr
              </motion.h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <motion.div style={{ color: headerTextColor }}>
                {["Explore", "Pricing", "Creators"].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    className="relative inline-flex items-center px-4 py-2 transition-colors duration-200 hover:opacity-80"
                  >
                    <span className="relative z-10">{item}</span>
                    <motion.div
                      className="absolute inset-0 -z-10 rounded-full"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                ))}
              </motion.div>
              
              <Button 
                variant="ghost" 
                asChild 
                className="hover:scale-105 transition-all duration-200"
              >
                <Link to="/login">Log In</Link>
              </Button>
              
              <Button 
                asChild 
                className="bg-white text-black hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
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
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Connect With Your Audience
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8"
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
                  className="bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all duration-200 px-8 py-6 text-lg rounded-full w-full sm:w-auto"
                  asChild
                >
                  <Link to="/register">
                    Start Creating
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-200 px-8 py-6 text-lg rounded-full w-full sm:w-auto"
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
