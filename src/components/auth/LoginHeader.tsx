interface LoginHeaderProps {
  isForgotPassword: boolean;
}

export const LoginHeader = ({ isForgotPassword }: LoginHeaderProps) => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-secondary bg-clip-text text-transparent">
        {isForgotPassword ? "Reset Password" : "Welcome Back"}
      </h1>
      <p className="text-luxury-neutral/80">
        {isForgotPassword 
          ? "Enter your email to receive a reset link" 
          : "Sign in to continue your journey"}
      </p>
    </div>
  );
};