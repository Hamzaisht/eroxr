import { useState } from "react";
import { EmailLogin } from "./EmailLogin";
import { SignupForm } from "./signup/SignupForm";
import { SocialLogin } from "./SocialLogin";
import { AuthLinks } from "./AuthLinks";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toggleMode = () => setIsSignup(!isSignup);

  const handleSocialLogin = async (provider: 'twitter' | 'google') => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: error.message
        });
      }
    } catch (error) {
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
    <div className="w-full max-w-md">
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 shadow-2xl border border-luxury-primary/20">
        <div className="text-center mb-8">
          <img
            src="/eroxr-logo.svg"
            alt="EROXR"
            className="w-32 h-32 mx-auto mb-4 transition-transform duration-300 hover:scale-110"
          />
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to EROXR</h2>
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
            <AuthLinks />
          </>
        )}
      </div>
    </div>
  );
};