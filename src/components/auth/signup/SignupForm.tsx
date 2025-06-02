
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Form } from "@/components/ui/form";
import { signupSchema, type SignupFormValues } from "../types";
import { SignupHeader } from "./SignupHeader";
import { SignupFooter } from "./SignupFooter";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "./AnimatedBackground";
import { FloatingParticles } from "./FloatingParticles";
import { FloatingIcons } from "./FloatingIcons";
import { AnimatedFormFields } from "./AnimatedFormFields";
import { AnimatedSubmitButton } from "./AnimatedSubmitButton";

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
            <SignupHeader />
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
                    <AnimatedFormFields form={form} isLoading={isLoading} />
                  </motion.div>
                </AnimatePresence>

                <AnimatedSubmitButton isLoading={isLoading} />
              </form>
            </Form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <SignupFooter onToggleMode={onToggleMode} />
          </motion.div>
        </div>

        <FloatingParticles />
      </motion.div>
    </motion.div>
  );
};
