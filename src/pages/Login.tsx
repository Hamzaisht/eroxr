import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SignupForm } from "@/components/auth/SignupForm";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-luxury-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
            Welcome to Dating App
          </h2>
          <p className="mt-2 text-luxury-neutral/80">
            Sign in or create an account to continue
          </p>
        </div>

        <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 shadow-2xl border border-luxury-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/10 via-luxury-accent/5 to-transparent rounded-2xl" />
          <div className="relative">
            <SignupForm />
          </div>
        </div>

        <p className="text-center text-sm text-luxury-neutral/60">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
};

export default Login;