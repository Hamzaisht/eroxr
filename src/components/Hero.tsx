import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Twitter, Mail } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();
  const supabase = useSupabaseClient();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
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

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-luxury-gradient flex items-center justify-center p-4">
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

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50 h-12 px-4"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50 h-12 px-4 pr-12"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-button-gradient hover:bg-hover-gradient transition-all duration-300 h-12 text-white font-medium text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-luxury-primary/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-luxury-neutral/80">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('twitter')}
                className="border-luxury-primary/20 text-white hover:bg-luxury-primary/10 transition-colors h-12"
                disabled={isLoading}
              >
                <Twitter className="w-5 h-5 mr-2" />
                Twitter
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                className="border-luxury-primary/20 text-white hover:bg-luxury-primary/10 transition-colors h-12"
                disabled={isLoading}
              >
                <Mail className="w-5 h-5 mr-2" />
                Google
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center space-y-2">
            <button className="text-sm text-luxury-neutral/80 hover:text-white transition-colors">
              Forgot your password?
            </button>
            <p className="text-sm text-luxury-neutral/80">
              Don't have an account?{" "}
              <button className="text-luxury-primary hover:text-luxury-secondary transition-colors">
                Sign up
              </button>
            </p>
          </div>

          <div className="mt-8 text-center text-xs text-luxury-neutral/60">
            <p>
              By signing in, you agree to our{" "}
              <a href="#" className="text-luxury-primary hover:text-luxury-secondary transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-luxury-primary hover:text-luxury-secondary transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};