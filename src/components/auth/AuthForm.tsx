import { useState } from "react";
import { EmailLogin } from "./EmailLogin";
import { SignupForm } from "./SignupForm";
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
            src="/placeholder.svg"
            alt="Eroxr"
            className="w-20 h-20 mx-auto mb-6 animate-logo-spin"
            style={{ filter: "brightness(0) invert(1)" }}
          />
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