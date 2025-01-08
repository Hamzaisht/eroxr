import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Mail, Lock, LogIn, Github } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export const EmailLogin = ({ onToggleMode }: { onToggleMode: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md space-y-8 p-8 rounded-2xl neo-blur"
    >
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gradient">
          Welcome to Dating App
        </h1>
        <p className="text-luxury-neutral/80">
          Sign in or create an account to continue
        </p>
      </div>

      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full h-12 bg-white/5 hover:bg-white/10 border-luxury-primary/20"
          disabled={isLoading}
        >
          <Github className="mr-2 h-5 w-5" />
          Sign in with Github
        </Button>

        <Button 
          variant="outline"
          className="w-full h-12 bg-white/5 hover:bg-white/10 border-luxury-primary/20"
          disabled={isLoading}
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-luxury-primary/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-luxury-dark px-2 text-luxury-neutral/60">
            Or continue with
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-luxury-neutral">
                  Email <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-luxury-neutral/50" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="Email address"
                      className="pl-10 h-12 bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50 focus:ring-luxury-primary/30 focus:border-luxury-primary/30"
                      disabled={isLoading}
                      autoComplete="email"
                      required
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-sm text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-luxury-neutral">
                  Password <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-luxury-neutral/50" />
                    <Input
                      {...field}
                      type="password"
                      placeholder="Password"
                      className="pl-10 h-12 bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50 focus:ring-luxury-primary/30 focus:border-luxury-primary/30"
                      disabled={isLoading}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-sm text-red-400" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-button-gradient hover:bg-hover-gradient transition-all duration-300 h-12 text-lg font-medium group relative overflow-hidden"
            disabled={isLoading}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? "Signing in..." : "Sign in"}
              <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </form>
      </Form>

      <div className="text-center space-y-2">
        <button 
          className="text-sm text-luxury-neutral/80 hover:text-luxury-primary transition-colors"
          onClick={() => {/* Add forgot password handler */}}
        >
          Forgot your password?
        </button>
        <p className="text-sm text-luxury-neutral/80">
          Don't have an account?{" "}
          <button
            onClick={onToggleMode}
            className="text-luxury-primary hover:text-luxury-accent transition-colors font-medium"
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
      </div>

      <p className="text-xs text-center text-luxury-neutral/60">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </p>
    </motion.div>
  );
};