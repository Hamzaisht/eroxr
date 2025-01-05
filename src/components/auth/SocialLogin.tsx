import { Twitter, Mail, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialLoginDivider } from "./SocialLoginDivider";

interface SocialLoginProps {
  onSocialLogin: (provider: 'twitter' | 'google' | 'github') => void;
  isLoading: boolean;
}

export const SocialLogin = ({ onSocialLogin, isLoading }: SocialLoginProps) => {
  return (
    <div className="space-y-6" role="group" aria-label="Social login options">
      <SocialLoginDivider />

      <div className="flex justify-center gap-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin('twitter')}
          className="border-luxury-primary/20 bg-white/5 text-white hover:bg-luxury-primary/20 hover:border-luxury-primary/40 transition-all duration-300 w-14 h-14 rounded-full p-0 group"
          disabled={isLoading}
          aria-label="Continue with Twitter"
        >
          <Twitter className="w-7 h-7 group-hover:text-luxury-primary transition-colors" />
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin('google')}
          className="border-luxury-primary/20 bg-white/5 text-white hover:bg-luxury-primary/20 hover:border-luxury-primary/40 transition-all duration-300 w-14 h-14 rounded-full p-0 group"
          disabled={isLoading}
          aria-label="Continue with Google"
        >
          <Mail className="w-7 h-7 group-hover:text-luxury-primary transition-colors" />
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin('github')}
          className="border-luxury-primary/20 bg-white/5 text-white hover:bg-luxury-primary/20 hover:border-luxury-primary/40 transition-all duration-300 w-14 h-14 rounded-full p-0 group"
          disabled={isLoading}
          aria-label="Continue with GitHub"
        >
          <Github className="w-7 h-7 group-hover:text-luxury-primary transition-colors" />
        </Button>
      </div>
    </div>
  );
};