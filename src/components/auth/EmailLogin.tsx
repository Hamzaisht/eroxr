import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LoginFields } from "./form-fields/LoginFields";
import { LoginHeader } from "./LoginHeader";
import { LoginActions } from "./LoginActions";
import { loginSchema, type LoginValues } from "./types";

export const EmailLogin = ({ onToggleMode }: { onToggleMode: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
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

  const handleForgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a password reset link.",
        });
        setIsForgotPassword(false);
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

  const onSubmit = async (values: LoginValues) => {
    if (isForgotPassword) {
      await handleForgotPassword(values.email);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Attempting login with:", values);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });

      if (error) {
        console.error("Login error:", error);
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
        navigate("/home");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
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
    <div className="space-y-8">
      <LoginHeader isForgotPassword={isForgotPassword} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <LoginFields 
            form={form} 
            isLoading={isLoading} 
            isForgotPassword={isForgotPassword} 
          />

          <Button
            type="submit"
            className="w-full bg-button-gradient hover:bg-hover-gradient transition-all duration-300 h-12 text-lg font-medium"
            disabled={isLoading}
          >
            {isLoading 
              ? (isForgotPassword ? "Sending..." : "Signing in...") 
              : (isForgotPassword ? "Send Reset Link" : "Sign In")}
          </Button>
        </form>
      </Form>

      <LoginActions 
        isLoading={isLoading}
        isForgotPassword={isForgotPassword}
        onToggleForgotPassword={() => setIsForgotPassword(!isForgotPassword)}
        onToggleMode={onToggleMode}
      />
    </div>
  );
};