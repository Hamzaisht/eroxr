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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8">
        <img
          src="/placeholder.svg"
          alt="Eroxr Logo"
          className="w-24 h-24 filter brightness-0 invert"
        />
      </div>

      {/* 3D Statues Container */}
      <div className="relative w-full max-w-md mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#B8860B] opacity-20 blur-xl" />
        <div className="relative bg-black/80 p-8 rounded-lg backdrop-blur-sm border border-[#FFD700]/20">
          <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-transparent bg-clip-text">
            Welcome to Eroxr
          </h1>

          {/* Login Form */}
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                className="w-full bg-black/50 border-[#FFD700]/30 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-black/50 border-[#FFD700]/30 text-white placeholder:text-gray-400"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#FFD700]/70 hover:text-[#FFD700] hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black hover:opacity-90"
                onClick={() => {}}
              >
                Sign in with Google
              </Button>
              <Button
                className="w-full bg-black text-white border border-[#FFD700]/30 hover:bg-[#FFD700]/10"
                onClick={() => {}}
              >
                Sign in with Apple
              </Button>
              <Button
                className="w-full bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90"
                onClick={() => {}}
              >
                Sign in with Twitter
              </Button>
            </div>

            {/* Footer Links */}
            <div className="flex flex-col items-center gap-2 mt-6 text-sm text-gray-400">
              <button className="hover:text-[#FFD700] transition-colors">
                Forgot password?
              </button>
              <button className="hover:text-[#FFD700] transition-colors">
                Sign up for Eroxr
              </button>
            </div>
          </div>

          {/* Terms Text */}
          <p className="mt-6 text-xs text-center text-gray-500">
            By signing up you agree with our terms of service and privacy policy and confirm that you are at least 18 years old
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-gray-500 max-w-2xl">
        <p>©2024 Eroxr</p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <button className="hover:text-[#FFD700]">Contact</button>
          <button className="hover:text-[#FFD700]">English</button>
          <button className="hover:text-[#FFD700]">Help</button>
          <button className="hover:text-[#FFD700]">About</button>
          <button className="hover:text-[#FFD700]">Blog</button>
          <button className="hover:text-[#FFD700]">Terms of Service</button>
          <button className="hover:text-[#FFD700]">Privacy</button>
        </div>
      </footer>
    </div>
  );
};

export default Login;