import { useState } from "react";
import { SignupForm } from "./signup/SignupForm";
import { EmailLogin } from "./EmailLogin";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

export const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);

  const toggleMode = () => {
    setIsSignup(!isSignup);
  };

  return (
    <div className="w-full space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={isSignup ? "signup" : "login"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="backdrop-blur-xl bg-white/5 p-8 border-luxury-primary/20">
            {isSignup ? (
              <SignupForm onToggleMode={toggleMode} />
            ) : (
              <EmailLogin onToggleMode={toggleMode} />
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};