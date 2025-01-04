import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UsernameField } from "./form-fields/UsernameField";
import { EmailField } from "./form-fields/EmailField";
import { PasswordFields } from "./form-fields/PasswordFields";
import { DateOfBirthField } from "./form-fields/DateOfBirthField";
import { signupSchema, type SignupFormValues } from "./types";

export const SignupForm = ({ onToggleMode }: { onToggleMode: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = useSupabaseClient();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
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
          },
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Please check your email to confirm your account.",
        });
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
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-secondary bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-luxury-neutral/80">
          Join our community today
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <UsernameField form={form} isLoading={isLoading} />
          <EmailField form={form} isLoading={isLoading} />
          <PasswordFields form={form} isLoading={isLoading} />
          <DateOfBirthField form={form} isLoading={isLoading} />

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full bg-button-gradient hover:bg-hover-gradient transition-all duration-300 h-12 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>

            <div className="text-sm text-luxury-neutral/70 text-center">
              By signing up, you confirm that you are at least 18 years old and agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-luxury-neutral/80">
          Already have an account?{" "}
          <button
            onClick={onToggleMode}
            className="text-luxury-primary hover:text-luxury-secondary transition-colors font-medium"
            disabled={isLoading}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};