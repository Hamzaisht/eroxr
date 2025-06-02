import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { SocialLoginSection } from "./sections/SocialLoginSection";
import { DividerWithText } from "./sections/DividerWithText";
import { LoginForm } from "./sections/LoginForm";
import { AuthApiError, Provider } from "@supabase/supabase-js";
import { Sparkles, Shield, Zap } from "lucide-react";

export const EmailLogin = ({ onToggleMode }: { onToggleMode: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { toast } = useToast();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Add debug logging
  useEffect(() => {
    console.log("EmailLogin component mounted");
    return () => console.log("EmailLogin component unmounted");
  }, []);

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
      
      // No need to manually navigate - AuthLayout will handle redirection
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
      {/* Dynamic background glow following mouse */}
      <motion.div
        className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-30"
        animate={{
          x: (mousePosition.x - window.innerWidth / 2) * 0.01,
          y: (mousePosition.y - window.innerHeight / 2) * 0.01,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      />
      
      {/* Main card */}
      <motion.div
        className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-2xl border border-gray-700/50 overflow-hidden"
        whileHover={{ 
          scale: 1.01,
          boxShadow: "0 20px 40px rgba(155, 135, 245, 0.15)"
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 p-8 space-y-8">
          {/* Header with floating icons */}
          <div className="text-center space-y-4">
            <motion.div
              className="flex justify-center items-center gap-3 mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </motion.div>
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <Shield className="w-6 h-6 text-purple-400" />
              </motion.div>
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Zap className="w-6 h-6 text-pink-400" />
              </motion.div>
            </motion.div>

            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Welcome Back
            </motion.h1>
            
            <motion.p 
              className="text-gray-400 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Sign in to continue your journey
            </motion.p>
          </div>

          {/* Social login section with enhanced animations */}
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

          {/* Footer with micro-animations */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.button 
              className="text-sm text-gray-400 hover:text-cyan-400 transition-all duration-300 relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {/* Add forgot password handler */}}
            >
              <span className="relative z-10">Forgot your password?</span>
              <motion.div
                className="absolute inset-0 bg-cyan-400/10 rounded-lg"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
            
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <motion.button
                onClick={onToggleMode}
                className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-medium relative group"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Sign up</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            </p>
          </motion.div>

          <motion.p 
            className="text-xs text-center text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
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

        {/* Floating particles */}
        <AnimatePresence>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 2) * 80}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 0.7, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
