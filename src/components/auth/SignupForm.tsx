import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Provider } from "@supabase/supabase-js";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { signupSchema, type SignupFormValues } from "./types";
import { EmailField } from "./form-fields/EmailField";
import { PasswordField } from "./form-fields/PasswordField";
import { DateOfBirthField } from "./form-fields/DateOfBirthField";
import { UsernameField } from "./form-fields/UsernameField";
import { CountrySelect } from "./form-fields/CountrySelect";
import { NameFields } from "./form-fields/NameFields";
import { SocialLogin } from "./SocialLogin";
import { motion } from "framer-motion";

interface SignupFormProps {
  onToggleMode: () => void;
}

export const SignupForm = ({ onToggleMode }: SignupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = useSupabaseClient();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      username: "",
      dateOfBirth: "",
      country: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            username: values.username,
            date_of_birth: values.dateOfBirth,
            country: values.country,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'twitter' | 'reddit') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      <SocialLogin onSocialLogin={handleSocialLogin} isLoading={isLoading} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <EmailField form={form} isLoading={isLoading} />
          <NameFields form={form} isLoading={isLoading} />
          <UsernameField form={form} isLoading={isLoading} />
          
          <div className="space-y-4">
            <PasswordField
              form={form}
              name="password"
              placeholder="Password"
              isLoading={isLoading}
            />
            <PasswordField
              form={form}
              name="confirmPassword"
              placeholder="Confirm Password"
              isLoading={isLoading}
            />
          </div>

          <DateOfBirthField form={form} isLoading={isLoading} />
          <CountrySelect form={form} isLoading={isLoading} />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed h-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-luxury-neutral/80">
          Already have an account?{" "}
          <button
            onClick={onToggleMode}
            className="text-luxury-primary hover:text-luxury-accent transition-colors font-medium"
            disabled={isLoading}
          >
            Sign in
          </button>
        </p>
      </div>
    </motion.div>
  );
};