
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SignupForm } from "@/components/auth/signup/SignupForm";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { BackgroundVideo } from "@/components/video/BackgroundVideo";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";
import { useAuth } from "@/contexts/AuthContext";
import { ErosPatternBackground } from "@/components/auth/backgrounds/ErosPatternBackground";

const Register = () => {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Register page - auth state:", { 
      user: user ? "exists" : "null", 
      session: session ? "exists" : "null",
      loading 
    });
    
    // If we have a session and not loading, redirect
    if (!loading && session && user) {
      const from = location.state?.from || "/home";
      console.log("User already authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, session, loading, navigate, location]);

  // Show loading while checking session
  if (loading) {
    console.log("Register page - showing loading screen");
    return <LoadingScreen />;
  }

  // If we have a session, show loading while redirecting
  if (session && user) {
    console.log("Register page - have session, showing loading during redirect");
    return <LoadingScreen />;
  }

  const handleToggleMode = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-luxury-dark flex items-center justify-center overflow-hidden relative">
      <BackgroundVideo 
        videoUrl="/background-video.mp4"
        fallbackImage="/bg-fallback.jpg"
        overlayOpacity={60}
      />
      
      <div className="fixed inset-0 pointer-events-none">
        <BackgroundEffects />
      </div>
      
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <motion.div
              className="relative backdrop-blur-xl overflow-hidden shadow-2xl"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(217, 70, 239, 0.2)"
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <ErosPatternBackground />
              
              <div className="relative z-10 p-8 space-y-8">
                <motion.div
                  className="text-center space-y-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <motion.h1 
                    className="text-5xl font-bold relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <motion.span
                      className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        backgroundSize: '200% auto',
                      }}
                    >
                      Join Eroxr
                    </motion.span>
                  </motion.h1>
                  
                  <motion.p 
                    className="text-gray-300 text-lg relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    Create your{" "}
                    <motion.span
                      className="text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text font-semibold"
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        backgroundSize: '200% auto',
                      }}
                    >
                      premium account
                    </motion.span>
                  </motion.p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <SignupForm onToggleMode={handleToggleMode} isLoginMode={false} />
                </motion.div>
              </div>
              
              {/* Floating particles with Eros theme */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full opacity-40"
                  style={{
                    background: `linear-gradient(45deg, ${
                      i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4'
                    }, transparent)`,
                    left: `${20 + i * 15}%`,
                    top: `${15 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 0.6, 0],
                    scale: [0, 1.2, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Register;
