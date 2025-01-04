import { useState } from "react";
import { EmailLogin } from "./EmailLogin";
import { SignupForm } from "./SignupForm";
import { SocialLogin } from "./SocialLogin";
import { AuthLinks } from "./AuthLinks";

export const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);

  const toggleMode = () => setIsSignup(!isSignup);

  return (
    <div className="w-full max-w-md">
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 shadow-2xl border border-luxury-primary/20">
        <div className="text-center mb-8">
          <img
            src="/placeholder.svg"
            alt="Eroxr"
            className="w-20 h-20 mx-auto mb-6 animate-logo-spin"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>

        {isSignup ? (
          <SignupForm onToggleMode={toggleMode} />
        ) : (
          <>
            <EmailLogin onToggleMode={toggleMode} />
            <SocialLogin />
            <AuthLinks />
          </>
        )}
      </div>
    </div>
  );
};