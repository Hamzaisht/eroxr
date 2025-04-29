
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/layout/LoadingScreen";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  // Add debug logging to help identify issues
  useEffect(() => {
    console.log("Login page rendering, session:", session ? "exists" : "null");
    
    if (session) {
      // Get the redirect path from location state or default to home
      const from = location.state?.from || "/home";
      console.log("User is logged in, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [session, navigate, location]);

  // Show loading while session is being determined
  if (session === undefined) {
    return <LoadingScreen />;
  }

  return (
    <AuthLayout>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-4 mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-luxury-neutral/80 text-lg">
              Sign in to continue your journey
            </p>
            <div className="flex justify-center space-x-2 text-sm text-luxury-neutral/60">
              <span>✨ Secure login</span>
              <span>•</span>
              <span>🔒 End-to-end encrypted</span>
            </div>
          </motion.div>
          <AuthForm />
        </motion.div>
      </AnimatePresence>
    </AuthLayout>
  );
};

export default Login;
