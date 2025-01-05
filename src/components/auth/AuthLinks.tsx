interface AuthLinksProps {
  onToggleMode: () => void;
}

export const AuthLinks = ({ onToggleMode }: AuthLinksProps) => {
  return (
    <>
      <div className="mt-8 text-center space-y-2">
        <p className="text-sm text-luxury-neutral/80">
          Don't have an account?{" "}
          <button 
            onClick={onToggleMode}
            className="text-luxury-primary hover:text-luxury-secondary transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>

      <div className="mt-8 text-center text-xs text-luxury-neutral/60">
        <p>
          By signing in, you agree to our{" "}
          <a 
            href="/terms" 
            className="text-luxury-primary hover:text-luxury-secondary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a 
            href="/privacy" 
            className="text-luxury-primary hover:text-luxury-secondary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </>
  );
};