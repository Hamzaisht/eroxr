export const SignupFooter = ({ onToggleMode }: { onToggleMode: () => void }) => {
  return (
    <div className="text-center space-y-4">
      <p className="text-sm text-luxury-neutral/70">
        By signing up, you confirm that you are at least 18 years old and agree to our Terms of Service and Privacy Policy
      </p>
      <p className="text-luxury-neutral/80">
        Already have an account?{" "}
        <button
          onClick={onToggleMode}
          className="text-luxury-primary hover:text-luxury-accent transition-colors font-medium"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};