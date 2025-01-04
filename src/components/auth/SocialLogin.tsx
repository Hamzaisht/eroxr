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

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin('twitter')}
          className="border-luxury-primary/20 text-white hover:bg-luxury-primary/10 transition-colors h-12"
          disabled={isLoading}
        >
          <Twitter className="w-5 h-5 mr-2" />
          Twitter
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin('google')}
          className="border-luxury-primary/20 text-white hover:bg-luxury-primary/10 transition-colors h-12"
          disabled={isLoading}
        >
          <Mail className="w-5 h-5 mr-2" />
          Google
        </Button>
      </div>
    </>
  );
};