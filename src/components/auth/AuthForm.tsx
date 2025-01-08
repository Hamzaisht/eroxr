import { useState } from "react";
import { SignupForm } from "./signup/SignupForm";
import { EmailLogin } from "./EmailLogin";
import { motion, AnimatePresence } from "framer-motion";

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
          {isSignup ? (
            <SignupForm onToggleMode={toggleMode} />
          ) : (
            <EmailLogin onToggleMode={toggleMode} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};