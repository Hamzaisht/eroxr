import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { signupSchema, type SignupFormValues } from "./types";
import { EmailField } from "./form-fields/EmailField";
import { PasswordField } from "./form-fields/PasswordField";
import { DateOfBirthField } from "./form-fields/DateOfBirthField";
import { UsernameField } from "./form-fields/UsernameField";
import { CountrySelect } from "./form-fields/CountrySelect";
import { motion } from "framer-motion";

export const SignupForm = ({ onToggleMode }: { onToggleMode: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = useSupabaseClient();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md space-y-6"
    >
      <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 shadow-2xl border border-luxury-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/10 via-luxury-accent/5 to-transparent rounded-2xl" />
        
        <div className="relative space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Join EROXR
            </h2>
            <p className="text-luxury-neutral/80">Create your account</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <EmailField form={form} isLoading={isLoading} />
              
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

              <UsernameField
                form={form}
                isLoading={isLoading}
              />

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

          <div className="text-center space-y-4">
            <p className="text-sm text-luxury-neutral/70">
              By signing up, you confirm that you are at least 18 years old and agree to our Terms of Service and Privacy Policy
            </p>
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
        </div>
      </div>
    </motion.div>
  );
};