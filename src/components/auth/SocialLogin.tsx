import { Button } from "@/components/ui/button";
import { Twitter, Mail } from "lucide-react";

interface SocialLoginProps {
  onSocialLogin: (provider: 'twitter' | 'google') => Promise<void>;
  isLoading: boolean;
}

export const SocialLogin = ({ onSocialLogin, isLoading }: SocialLoginProps) => {
  return (
    <>
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-luxury-primary/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-transparent text-luxury-neutral/80">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin('twitter')}
          className="border-luxury-primary/20 bg-white/5 text-white hover:bg-luxury-primary/20 hover:border-luxury-primary/40 transition-all duration-300 h-12 group"
          disabled={isLoading}
        >
          <Twitter className="w-6 h-6 group-hover:text-luxury-primary transition-colors" />
          <span className="sr-only">Sign in with Twitter</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin('google')}
          className="border-luxury-primary/20 bg-white/5 text-white hover:bg-luxury-primary/20 hover:border-luxury-primary/40 transition-all duration-300 h-12 group"
          disabled={isLoading}
        >
          <Mail className="w-6 h-6 group-hover:text-luxury-primary transition-colors" />
          <span className="sr-only">Sign in with Google</span>
        </Button>
      </div>

      <Button 
        type="submit"
        className="w-full bg-button-gradient hover:bg-hover-gradient transition-all duration-300 h-12 text-lg font-medium"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "LOGIN"}
      </Button>
    </>
  );
};