import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { SocialLoginSection } from "./sections/SocialLoginSection";
import { DividerWithText } from "./sections/DividerWithText";
import { LoginForm } from "./sections/LoginForm";
import { AuthError, AuthApiError, Provider } from "@supabase/supabase-js";

export const EmailLogin = ({ onToggleMode }: { onToggleMode: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values: { identifier: string; password: string; rememberMe: boolean }) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.identifier,
        password: values.password,
      });

      if (error) {
        if (error instanceof AuthApiError) {
          switch (error.status) {
            case 400:
              toast({
                title: "Login failed",
                description: "Invalid email or password. Please check your credentials and try again.",
                variant: "destructive",
              });
              break;
            case 422:
              toast({
                title: "Invalid format",
                description: "Please enter a valid email address.",
                variant: "destructive",
              });
              break;
            default:
              toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
              });
          }
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: Provider) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
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
      className="w-full space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gradient">
          Welcome Back
        </h1>
        <p className="text-luxury-neutral/80">
          Sign in to continue to your account
        </p>
      </div>

      <SocialLoginSection 
        onGoogleLogin={() => handleSocialLogin('google')}
        onTwitterLogin={() => handleSocialLogin('twitter')}
        onGithubLogin={() => handleSocialLogin('github')}
        isLoading={isLoading}
      />
      
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