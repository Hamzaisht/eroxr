
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { SocialLoginSection } from "./sections/SocialLoginSection";
import { DividerWithText } from "./sections/DividerWithText";
import { LoginForm } from "./sections/LoginForm";
import { AuthApiError, Provider } from "@supabase/supabase-js";
import { Sparkles, Shield, Zap, User, Lock } from "lucide-react";

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
      {/* Dynamic background glow following mouse */}
      <motion.div
        className="absolute -inset-6 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-40"
        animate={{
          x: (mousePosition.x - window.innerWidth / 2) * 0.02,
          y: (mousePosition.y - window.innerHeight / 2) * 0.02,
          rotate: [0, 1, -1, 0],
        }}
        transition={{ 
          x: { type: "spring", stiffness: 50, damping: 30 },
          y: { type: "spring", stiffness: 50, damping: 30 },
          rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      {/* Main card */}
      <motion.div
        className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-2xl border border-gray-700/50 overflow-hidden"
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 25px 50px rgba(6, 182, 212, 0.2)"
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated gradient border */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "conic-gradient(from 0deg at 50% 50%, #06b6d4, #8b5cf6, #ec4899, #06b6d4)",
            padding: "2px",
            borderRadius: "1rem",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl" />
        </motion.div>
        
        {/* Content */}
        <div className="relative z-10 p-8 space-y-8">
          {/* Header with floating icons */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex justify-center items-center gap-4 mb-6">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <Shield className="w-8 h-8 text-purple-400" />
              </motion.div>
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Zap className="w-8 h-8 text-pink-400" />
              </motion.div>
            </div>

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
              
              {/* Floating sparkles around text */}
              <motion.div
                className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5,
                }}
              />
              <motion.div
                className="absolute -bottom-1 -left-3 w-2 h-2 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full"
                animate={{
                  scale: [0, 1.3, 0],
                  opacity: [0, 0.8, 0],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: 1,
                }}
              />
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
          </motion.div>

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

          {/* Footer with enhanced animations */}
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
                className="absolute inset-0 bg-cyan-400/10 rounded-lg blur-sm"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.2, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <motion.button
                onClick={onToggleMode}
                className="relative text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-medium group"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Sign up</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-lg blur-sm"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.2, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </p>
            
            <motion.div
              className="flex items-center justify-center gap-2 text-xs text-gray-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <motion.div
                className="w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span>Secure access portal</span>
              <motion.div
                className="w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </motion.div>
          </motion.div>

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

        {/* Floating particles */}
        <AnimatePresence>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `linear-gradient(45deg, ${
                  i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#8b5cf6' : '#ec4899'
                }, transparent)`,
                left: `${15 + i * 12}%`,
                top: `${10 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
