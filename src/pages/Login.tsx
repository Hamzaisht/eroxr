import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { BackgroundVideo } from "@/components/video/BackgroundVideo";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";
import { useAuth } from "@/contexts/AuthContext";
import { SignupForm } from "@/components/auth/signup/SignupForm";
import { ErosPatternBackground } from "@/components/auth/backgrounds/ErosPatternBackground";
import { ErrorState } from "@/components/ui/ErrorState";

const Login = () => {
  const { user, session, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Login page - auth state:", { 
      user: user ? "exists" : "null", 
      session: session ? "exists" : "null",
      loading,
      error: error || "none"
    });
    
    // If we have a session and not loading, redirect
    if (!loading && session && user) {
      const from = location.state?.from || "/home";
      console.log("User already authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, session, loading, navigate, location, error]);

  // Show loading while checking session
  if (loading) {
    console.log("Login page - showing loading screen");
    return <LoadingScreen />;
  }

  // If we have a session, show loading while redirecting
  if (session && user) {
    console.log("Login page - have session, showing loading during redirect");
    return <LoadingScreen />;
  }

  const handleToggleMode = () => {
    clearError(); // Clear any existing errors
    navigate("/register");
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

      {/* Eros Pattern Background */}
      <ErosPatternBackground />
      
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {error && (
          <div className="mb-4">
            <ErrorState 
              title="Login Error"
              description={error}
              onRetry={clearError}
            />
          </div>
        )}
        
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <motion.div
              className="relative backdrop-blur-xl bg-gray-900/40 border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(6, 182, 212, 0.2)"
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
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
                      className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
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
                      Welcome Back
                    </motion.span>
                  </motion.h1>
                  
                  <motion.p 
                    className="text-gray-300 text-lg relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    Sign in to your{" "}
                    <motion.span
                      className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-semibold"
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

                  {/* Security badges */}
                  <motion.div
                    className="flex items-center justify-center gap-4 text-xs text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <div className="flex items-center gap-1">
                      <span>🔒</span>
                      <span>Secure login</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🔐</span>
                      <span>End-to-end encrypted</span>
                    </div>
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <SignupForm onToggleMode={handleToggleMode} isLoginMode={true} />
                </motion.div>
              </div>
              
              {/* Floating particles with Eros theme */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full opacity-40"
                  style={{
                    background: `linear-gradient(45deg, ${
                      i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#8b5cf6' : '#ec4899'
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
};

export default Login;
