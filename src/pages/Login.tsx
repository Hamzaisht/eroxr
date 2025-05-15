
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion } from "framer-motion";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { BackgroundVideo } from "@/components/video/BackgroundVideo";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectAttempted = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  // Add debug logging
  useEffect(() => {
    console.log("Login page rendered with session:", session ? "exists" : "null");
    
    // If we have a session and haven't attempted to redirect yet
    if (session && !redirectAttempted.current) {
      redirectAttempted.current = true;
      setIsLoading(true);
      
      // Get the redirect path from location state or default to home
      const from = location.state?.from || "/home";
      console.log("User is logged in, redirecting to:", from);
      
      // Use setTimeout to break potential infinite loops
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    }
  }, [session, navigate, location]);

  // Show loading while session is being determined
  if (session === undefined || isLoading) {
    return <LoadingScreen />;
  }

  // Only render the login form if there's no session
  if (session) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen w-full bg-luxury-dark flex items-center justify-center overflow-auto">
      {/* Background Video */}
      <BackgroundVideo 
        videoUrl="/background-video.mp4"
        fallbackImage="/bg-fallback.jpg"
        overlayOpacity={60}
      />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <BackgroundEffects />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <AuthForm />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
