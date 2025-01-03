import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-luxury-gradient flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] bg-luxury-primary/5 backdrop-blur-3xl rotate-12 transform-gpu"></div>
        <div className="absolute -inset-[10px] bg-luxury-secondary/5 backdrop-blur-3xl -rotate-12 transform-gpu"></div>
      </div>

      {/* Logo */}
      <div className="mb-8 relative z-10">
        <img
          src="/placeholder.svg"
          alt="Eroxr Logo"
          className="w-24 h-24 filter brightness-0 invert animate-fade-up"
        />
      </div>

      {/* Login Container */}
      <div className="relative w-full max-w-md mb-8 z-10">
        <div className="relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-luxury-primary/20">
          <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-luxury-primary to-luxury-secondary bg-clip-text text-transparent">
            Welcome to Eroxr
          </h1>

          {/* Login Form */}
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                className="bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-button-gradient hover:bg-hover-gradient transition-all duration-300 text-white font-medium"
                onClick={() => {}}
              >
                Sign in with Google
              </Button>
              <Button
                variant="outline"
                className="w-full border-luxury-primary/20 text-white hover:bg-white/10 transition-colors"
                onClick={() => {}}
              >
                Sign in with Apple
              </Button>
              <Button
                className="w-full bg-button-gradient hover:bg-hover-gradient transition-all duration-300 text-white font-medium"
                onClick={() => {}}
              >
                Sign in with Twitter
              </Button>
            </div>

            {/* Footer Links */}
            <div className="flex flex-col items-center gap-2 mt-6 text-sm text-white/70">
              <button className="hover:text-white transition-colors">
                Forgot password?
              </button>
              <button className="hover:text-white transition-colors">
                Sign up for Eroxr
              </button>
            </div>
          </div>

          {/* Terms Text */}
          <p className="mt-6 text-xs text-center text-white/50">
            By signing up you agree with our terms of service and privacy policy and confirm that you are at least 18 years old
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-white/50 max-w-2xl relative z-10">
        <p>©2024 Eroxr</p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <button className="hover:text-white">Contact</button>
          <button className="hover:text-white">English</button>
          <button className="hover:text-white">Help</button>
          <button className="hover:text-white">About</button>
          <button className="hover:text-white">Blog</button>
          <button className="hover:text-white">Terms of Service</button>
          <button className="hover:text-white">Privacy</button>
        </div>
      </footer>
    </div>
  );
};

export default Login;