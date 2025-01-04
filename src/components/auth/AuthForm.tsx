import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { SocialLogin } from "./SocialLogin";
import { EmailLogin } from "./EmailLogin";
import { AuthLinks } from "./AuthLinks";

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'twitter' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
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
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-luxury-primary to-luxury-secondary bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-luxury-neutral/80">Sign in to continue your journey</p>
        </div>

        <EmailLogin onSubmit={handleSignIn} isLoading={isLoading} />
        <SocialLogin onSocialLogin={handleSocialLogin} isLoading={isLoading} />
        <AuthLinks />
      </div>
    </div>
  );
};