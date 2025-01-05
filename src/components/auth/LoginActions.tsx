import { Button } from "@/components/ui/button";

interface LoginActionsProps {
  isLoading: boolean;
  isForgotPassword: boolean;
  onToggleForgotPassword: () => void;
  onToggleMode: () => void;
}

export const LoginActions = ({ 
  isLoading, 
  isForgotPassword, 
  onToggleForgotPassword, 
  onToggleMode 
}: LoginActionsProps) => {
  return (
    <div className="text-center space-y-2">
      <button 
        className="text-sm text-luxury-neutral/80 hover:text-white transition-colors"
        onClick={onToggleForgotPassword}
        type="button"
      >
        {isForgotPassword ? "Back to login" : "Forgot your password?"}
      </button>
      <p className="text-sm text-luxury-neutral/80">
        Don't have an account?{" "}
        <button
          onClick={onToggleMode}
          className="text-luxury-primary hover:text-luxury-secondary transition-colors font-medium"
          disabled={isLoading}
          type="button"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};