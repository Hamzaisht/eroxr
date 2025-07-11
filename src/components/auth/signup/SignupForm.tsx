
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { signupSchema, loginSchema, type SignupFormValues, type LoginFormValues } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedFormFields } from "./AnimatedFormFields";
import { AnimatedSubmitButton } from "./AnimatedSubmitButton";
import { useAuth } from "@/contexts/AuthContext";

interface SignupFormProps {
  onToggleMode: () => void;
  isLoginMode?: boolean;
}

export const SignupForm = ({ onToggleMode, isLoginMode = false }: SignupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  // Create separate forms for login and signup
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      dateOfBirth: "",
      country: "",
      firstName: "",
      lastName: "",
    },
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const form = isLoginMode ? loginForm : signupForm;

  const onSubmit = async (values: SignupFormValues | LoginFormValues) => {
    console.log("Form submission started", { isLoginMode, email: values.email });
    setIsLoading(true);
    
    try {
      if (isLoginMode) {
        console.log("Attempting login with email:", values.email);
        
        const { data, error } = await signIn(values.email, values.password);

        if (error) {
          console.error("Login error:", error);
          throw error;
        }

        if (data?.user && data?.session) {
          console.log("Login successful - user and session received");
          
          toast({
            title: "Welcome back!",
            description: "You have been successfully logged in.",
          });
        } else {
          console.error("Login succeeded but missing user or session data");
          throw new Error("Login succeeded but session data is incomplete");
        }
      } else {
        console.log("Attempting signup with email:", values.email);
        
        // Type assertion for signup values
        const signupValues = values as SignupFormValues;
        
        const metadata = {
          username: signupValues.username,
          first_name: signupValues.firstName,
          last_name: signupValues.lastName,
          date_of_birth: signupValues.dateOfBirth,
          country: signupValues.country,
        };

        const { data, error } = await signUp(signupValues.email, signupValues.password, metadata);

        console.log("Signup response:", { data, error });

        if (error) {
          console.error("Signup error:", error);
          throw error;
        }

        toast({
          title: "Success!",
          description: "Please check your email to confirm your account.",
        });
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      let errorMessage = error.message || "An unexpected error occurred";
      
      // Handle specific error cases
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please check your email and click the confirmation link before signing in.";
      } else if (error.message?.includes("User already registered")) {
        errorMessage = "An account with this email already exists. Please sign in instead.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -50, scale: 0.95 }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key="form-fields"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <AnimatedFormFields form={form} isLoading={isLoading} isLoginMode={isLoginMode} />
          </motion.div>
        </AnimatePresence>

        <AnimatedSubmitButton isLoading={isLoading} isLoginMode={isLoginMode} />

        <motion.div
          className="text-center pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <p className="text-sm text-gray-400">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              {isLoginMode ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </form>
    </Form>
  );
};
