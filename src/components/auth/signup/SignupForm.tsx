
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { signupSchema, loginSchema, type SignupFormValues, type LoginFormValues } from "../types";
import { SignupHeader } from "./SignupHeader";
import { SignupFooter } from "./SignupFooter";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "./AnimatedBackground";
import { FloatingParticles } from "./FloatingParticles";
import { FloatingIcons } from "./FloatingIcons";
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

  // Use different schemas and default values based on mode
  const form = useForm<SignupFormValues | LoginFormValues>({
    resolver: zodResolver(isLoginMode ? loginSchema : signupSchema),
    defaultValues: isLoginMode ? {
      email: "",
      password: "",
    } : {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-md mx-auto"
    >
      <AnimatedBackground />

      {/* Main card */}
      <motion.div
        className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-2xl border border-gray-700/50 overflow-hidden"
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 25px 50px rgba(217, 70, 239, 0.2)"
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Content */}
        <div className="relative z-10 p-8 space-y-8">
          {/* Header with floating elements */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <FloatingIcons />
            <SignupHeader isLoginMode={isLoginMode} />
          </motion.div>

          {/* Form with step animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
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
              </form>
            </Form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <SignupFooter onToggleMode={onToggleMode} isLoginMode={isLoginMode} />
          </motion.div>
        </div>

        <FloatingParticles />
      </motion.div>
    </motion.div>
  );
};
