import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupSchema, type SignupFormValues } from "./types";
import { PasswordField } from "./form-fields/PasswordField";
import { CountrySelect } from "./form-fields/CountrySelect";
import { motion } from "framer-motion";

export const SignupForm = ({ onToggleMode }: { onToggleMode: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
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

  const checkUsername = async (username: string) => {
    setIsCheckingUsername(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .ilike("username", username)
        .limit(1);

      if (error) throw error;
      return data.length === 0;
    } catch (error) {
      console.error("Error checking username:", error);
      return false;
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      const isUsernameAvailable = await checkUsername(values.username);
      if (!isUsernameAvailable) {
        form.setError("username", {
          type: "manual",
          message: "Username is already taken",
        });
        return;
      }

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
      className="w-full max-w-md space-y-8 p-8 rounded-2xl neo-blur"
    >
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-luxury-neutral/80">Join our community today</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            {/* Email Field */}
            <Input
              type="email"
              placeholder="Email address"
              {...form.register("email")}
              className="h-12 bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50"
              disabled={isLoading}
            />

            {/* Password Fields */}
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

            {/* Username Field */}
            <Input
              placeholder="Username"
              {...form.register("username")}
              className="h-12 bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50"
              disabled={isLoading || isCheckingUsername}
            />

            {/* Date of Birth Field */}
            <Input
              type="date"
              {...form.register("dateOfBirth")}
              className="h-12 bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50"
              disabled={isLoading}
            />

            {/* Country Select */}
            <CountrySelect form={form} isLoading={isLoading} />
          </div>

          <Button
            type="submit"
            className="w-full bg-button-gradient hover:bg-hover-gradient transition-all duration-300 h-12 text-lg font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
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
    </motion.div>
  );
};