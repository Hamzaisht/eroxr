
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { SignupForm } from "@/components/auth/signup/SignupForm";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { BackgroundVideo } from "@/components/video/BackgroundVideo";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";

const Register = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    console.log("Register page - session:", session ? "exists" : "null");
    
    // Check for session changes and redirect if authenticated
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log("Current session check:", currentSession ? "exists" : "null");
      
      if (currentSession) {
        const from = location.state?.from || "/home";
        console.log("User is already logged in, redirecting to:", from);
        navigate(from, { replace: true });
        return;
      }
      setIsCheckingSession(false);
    };

    checkSession();
  }, [navigate, location, supabase]);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, session ? "session exists" : "no session");
      
      if (event === 'SIGNED_IN' && session) {
        const from = location.state?.from || "/home";
        console.log("User signed in, redirecting to:", from);
        navigate(from, { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location, supabase]);

  // Show loading while checking session
  if (isCheckingSession || session === undefined) {
    return <LoadingScreen />;
  }

  // If authenticated, redirect (this should be handled by the useEffect above)
  if (session) {
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
            <SignupForm onToggleMode={handleToggleMode} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Register;
