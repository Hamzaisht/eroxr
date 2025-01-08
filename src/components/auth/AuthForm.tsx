import { useState } from "react";
import { SignupForm } from "./SignupForm";
import { EmailLogin } from "./EmailLogin";
import { motion } from "framer-motion";

export const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(true);

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
        <EmailLogin onToggleMode={toggleMode} />
      )}
    </motion.div>
  );
};