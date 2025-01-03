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
    <div className="min-h-screen bg-purple-gradient">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <img
                src="/placeholder.svg"
                alt="Eroxr"
                className="w-20 h-20 mx-auto mb-6 animate-fade-up"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gold-200 to-gold-400 bg-clip-text text-transparent">
                Welcome to Eroxr
              </h1>
              <p className="text-luxury-softgray">Connect with amazing creators</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  disabled={isLoading}
                  required
                />
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gold-gradient hover:opacity-90 text-white font-semibold transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-luxury-softgray">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('twitter')}
                  className="w-full border-white/20 text-white hover:bg-white/10 transition-colors duration-300"
                  disabled={isLoading}
                >
                  <Twitter className="w-5 h-5 mr-2" />
                  Twitter
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('google')}
                  className="w-full border-white/20 text-white hover:bg-white/10 transition-colors duration-300"
                  disabled={isLoading}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Google
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-luxury-softgray">
              <p>
                By signing in, you agree to our{" "}
                <a href="#" className="text-gold-300 hover:text-gold-200 transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-gold-300 hover:text-gold-200 transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};