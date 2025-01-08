import { useState } from "react";
import { SignupForm } from "./SignupForm";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(true);
  const { toast } = useToast();

  const toggleMode = () => setIsSignup(!isSignup);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      {isSignup ? (
        <SignupForm onToggleMode={toggleMode} />
      ) : (
        <div className="text-center">
          <p className="text-luxury-neutral/80">
            Already have an account?{" "}
            <button
              onClick={toggleMode}
              className="text-luxury-primary hover:text-luxury-accent transition-colors font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      )}
    </motion.div>
  );
};