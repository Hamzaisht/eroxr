export const AuthLinks = () => {
  return (
    <>
      <div className="mt-8 text-center space-y-2">
        <button className="text-sm text-luxury-neutral/80 hover:text-white transition-colors">
          Forgot your password?
        </button>
        <p className="text-sm text-luxury-neutral/80">
          Don't have an account?{" "}
          <button className="text-luxury-primary hover:text-luxury-secondary transition-colors">
            Sign up
          </button>
        </p>
      </div>

      <div className="mt-8 text-center text-xs text-luxury-neutral/60">
        <p>
          By signing in, you agree to our{" "}
          <a href="#" className="text-luxury-primary hover:text-luxury-secondary transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-luxury-primary hover:text-luxury-secondary transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </>
  );
};