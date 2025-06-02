
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { SocialLoginSection } from "./sections/SocialLoginSection";
import { DividerWithText } from "./sections/DividerWithText";
import { LoginForm } from "./sections/LoginForm";
import { AuthApiError, Provider } from "@supabase/supabase-js";
import { AnimatedBackground } from "./login/AnimatedBackground";
import { AnimatedHeader } from "./login/AnimatedHeader";
import { AuthFooter } from "./login/AuthFooter";
import { FloatingParticles } from "./login/FloatingParticles";

export const EmailLogin = ({ onToggleMode }: { onToggleMode: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (values: { identifier: string; password: string; rememberMe: boolean }) => {
    try {
      setIsLoading(true);
      console.log("Attempting login with:", values.identifier);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.identifier,
        password: values.password,
      });

      if (error) {
        console.error("Login error:", error);
        
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

      console.log("Login successful, data:", data);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
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
      console.log(`Attempting social login with provider: ${provider}`);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error(`Social login error (${provider}):`, error);
        throw error;
      }
    } catch (error: any) {
      console.error(`Social login error (${provider}):`, error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to authenticate with social provider",
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
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-md mx-auto"
    >
      <AnimatedBackground />
      
      {/* Main card */}
      <motion.div
        className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-2xl border border-gray-700/50 overflow-hidden"
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 25px 50px rgba(6, 182, 212, 0.2)"
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Content */}
        <div className="relative z-10 p-8 space-y-8">
          <AnimatedHeader />

          {/* Social login section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <SocialLoginSection 
              onGoogleLogin={() => handleSocialLogin('google')}
              onTwitterLogin={() => handleSocialLogin('twitter')}
              onGithubLogin={() => handleSocialLogin('github')}
              isLoading={isLoading}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <DividerWithText text="Or continue with email" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
          </motion.div>

          <AuthFooter onToggleMode={onToggleMode} isLoading={isLoading} />

          <motion.p 
            className="text-xs text-center text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            By signing in, you agree to our{" "}
            <span className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">
              Terms of Service
            </span>
            {" "}and{" "}
            <span className="text-purple-400 hover:text-purple-300 transition-colors cursor-pointer">
              Privacy Policy
            </span>
          </motion.p>
        </div>

        <FloatingParticles />
      </motion.div>
    </motion.div>
  );
};
