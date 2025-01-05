import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmailLogin } from "./EmailLogin";
import { SignupForm } from "./SignupForm";
import { SocialLogin } from "./SocialLogin";
import { AuthLinks } from "./AuthLinks";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleMode = () => setIsSignup(!isSignup);

  const handleSocialLogin = async (provider: 'twitter' | 'google' | 'github') => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error("Social login error:", error);
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: error.message
        });
      }
    } catch (error) {
      console.error("Unexpected error during social login:", error);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md" role="main" aria-label="Authentication form">
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 shadow-2xl border border-luxury-primary/20">
        <div className="text-center mb-8">
          <img
            src="/eroxr-logo.svg"
            alt="EROXR"
            className="w-32 h-32 mx-auto mb-4 transition-transform duration-300 hover:scale-110"
          />
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to EROXR</h1>
        </div>

        {isSignup ? (
          <SignupForm onToggleMode={toggleMode} />
        ) : (
          <>
            <EmailLogin onToggleMode={toggleMode} />
            <SocialLogin 
              onSocialLogin={handleSocialLogin}
              isLoading={isLoading}
            />
            <AuthLinks onToggleMode={toggleMode} />
          </>
        )}
      </div>
    </div>
  );
};