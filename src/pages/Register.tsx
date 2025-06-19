
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SignupForm } from "@/components/auth/signup/SignupForm";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { BackgroundVideo } from "@/components/video/BackgroundVideo";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedBackground } from "@/components/auth/signup/AnimatedBackground";
import { FloatingParticles } from "@/components/auth/signup/FloatingParticles";
import { FloatingIcons } from "@/components/auth/signup/FloatingIcons";

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
    <div className="min-h-screen w-full bg-luxury-dark flex items-center justify-center overflow-auto">
      <BackgroundVideo 
        videoUrl="/background-video.mp4"
        fallbackImage="/bg-fallback.jpg"
        overlayOpacity={60}
      />
      
      <div className="fixed inset-0 pointer-events-none">
        <BackgroundEffects />
      </div>
      
      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-24">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto"
          >
            <motion.div
              className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-2xl border border-gray-700/50 overflow-hidden"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(217, 70, 239, 0.2)"
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatedBackground />
              
              <div className="relative z-10 p-8 space-y-8">
                <motion.div
                  className="text-center space-y-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <FloatingIcons />
                  
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
                      Join Us
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
              
              <FloatingParticles />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Register;
