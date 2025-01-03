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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8">
        <img
          src="/placeholder.svg"
          alt="Eroxr Logo"
          className="w-24 h-24"
        />
      </div>

      {/* Login Container */}
      <div className="relative w-full max-w-md mb-8">
        <div className="relative bg-card p-8 rounded-lg shadow-lg border">
          <h1 className="text-3xl font-bold text-center mb-6 text-foreground">
            Welcome to Eroxr
          </h1>

          {/* Login Form */}
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                className="w-full"
              />
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={() => {}}
              >
                Sign in with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {}}
              >
                Sign in with Apple
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {}}
              >
                Sign in with Twitter
              </Button>
            </div>

            {/* Footer Links */}
            <div className="flex flex-col items-center gap-2 mt-6 text-sm text-muted-foreground">
              <button className="hover:text-primary transition-colors">
                Forgot password?
              </button>
              <button className="hover:text-primary transition-colors">
                Sign up for Eroxr
              </button>
            </div>
          </div>

          {/* Terms Text */}
          <p className="mt-6 text-xs text-center text-muted-foreground">
            By signing up you agree with our terms of service and privacy policy and confirm that you are at least 18 years old
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-muted-foreground max-w-2xl">
        <p>©2024 Eroxr</p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <button className="hover:text-primary">Contact</button>
          <button className="hover:text-primary">English</button>
          <button className="hover:text-primary">Help</button>
          <button className="hover:text-primary">About</button>
          <button className="hover:text-primary">Blog</button>
          <button className="hover:text-primary">Terms of Service</button>
          <button className="hover:text-primary">Privacy</button>
        </div>
      </footer>
    </div>
  );
};

export default Login;