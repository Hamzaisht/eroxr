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

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  const handleSocialLogin = async (provider: 'twitter' | 'google' | 'apple') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <img
              src="/placeholder.svg"
              alt="Eroxr"
              className="w-24 h-24 mx-auto mb-8"
              style={{ filter: "brightness(0) invert(1) sepia(1) saturate(10000%) hue-rotate(330deg)" }}
            />
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Welcome to Eroxr
            </h1>
            <p className="text-gray-400">Connect with amazing creators</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold"
            >
              Sign In
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('twitter')}
                className="w-full border-gray-700 hover:bg-gray-900"
              >
                <Twitter className="w-5 h-5 mr-2" />
                Twitter
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                className="w-full border-gray-700 hover:bg-gray-900"
              >
                <Mail className="w-5 h-5 mr-2" />
                Google
              </Button>
            </div>
          </form>

          <div className="text-center text-sm text-gray-400">
            <p>
              By signing in, you agree to our{" "}
              <a href="#" className="text-gold-400 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-gold-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};