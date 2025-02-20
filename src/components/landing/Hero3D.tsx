
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const RollingText = ({ children, href }: { children: string; href: string }) => {
  return (
    <Link 
      to={href} 
      className="group relative inline-block overflow-hidden px-4 py-2 text-white"
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

const WaveButton = ({ children, className, ...props }: { children: React.ReactNode; className?: string }) => {
  return (
    <button 
      className={`relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition duration-300 ease-out rounded-full group ${className}`} 
      {...props}
    >
      <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-luxury-primary group-hover:translate-x-0 ease">
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          >
          </path>
        </svg>
      </span>
      <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
        {children}
      </span>
      <span className="relative invisible">{children}</span>
    </button>
  );
};

export const Hero3D = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(13, 17, 23, 0)", "rgba(13, 17, 23, 1)"]
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
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-200"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between relative z-10">
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
                className="text-white hover:bg-transparent"
              >
                <Link to="/login">Log In</Link>
              </Button>
              
              <Link to="/register">
                <WaveButton className="bg-luxury-primary">
                  Sign Up
                </WaveButton>
              </Link>
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
                <Link to="/register">
                  <WaveButton className="bg-luxury-primary w-full sm:w-auto">
                    Start Creating
                  </WaveButton>
                </Link>
                <Link to="/about">
                  <WaveButton className="bg-transparent border-2 border-white w-full sm:w-auto">
                    Learn More
                  </WaveButton>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};
