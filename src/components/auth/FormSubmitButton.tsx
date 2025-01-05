import { Button } from "@/components/ui/button";

interface FormSubmitButtonProps {
  isLoading: boolean;
  isForgotPassword: boolean;
}

export const FormSubmitButton = ({ isLoading, isForgotPassword }: FormSubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full bg-button-gradient hover:bg-hover-gradient transition-all duration-300 h-12 text-lg font-medium"
      disabled={isLoading}
    >
      {isLoading 
        ? (isForgotPassword ? "Sending..." : "Signing in...") 
        : (isForgotPassword ? "Send Reset Link" : "Sign In")}
    </Button>
  );
};