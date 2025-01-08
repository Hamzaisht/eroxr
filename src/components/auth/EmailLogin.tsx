import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { SocialLoginSection } from "./sections/SocialLoginSection";
import { DividerWithText } from "./sections/DividerWithText";
import { LoginForm } from "./sections/LoginForm";

export const EmailLogin = ({ onToggleMode }: { onToggleMode: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleSubmit = async (values: { identifier: string; password: string; rememberMe: boolean }) => {
    try {
      setIsLoading(true);
      
      // Try to sign in with email first
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.identifier,
        password: values.password,
      });

      if (signInError) {
        // If email login fails, try username
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', values.identifier)
          .single();

        if (profileError || !profiles) {
          throw signInError;
        }

        // Try to sign in with the found user's email
        const { error: finalError } = await supabase.auth.signInWithPassword({
          email: profiles.id,
          password: values.password,
        });

        if (finalError) throw finalError;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate("/home");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gradient">
          Welcome Back
        </h1>
        <p className="text-luxury-neutral/80">
          Sign in to continue to your account
        </p>
      </div>

      <SocialLoginSection isLoading={isLoading} />
      <DividerWithText text="Or continue with" />
      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />

      <div className="text-center space-y-2">
        <button 
          className="text-sm text-luxury-neutral/80 hover:text-luxury-primary transition-colors"
          onClick={() => {/* Add forgot password handler */}}
        >
          Forgot your password?
        </button>
        <p className="text-sm text-luxury-neutral/80">
          Don't have an account?{" "}
          <button
            onClick={onToggleMode}
            className="text-luxury-primary hover:text-luxury-accent transition-colors font-medium"
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
      </div>

      <p className="text-xs text-center text-luxury-neutral/60">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </motion.div>
  );
};