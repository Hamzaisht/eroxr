import { Chrome, Twitter, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialLoginProps {
  onSocialLogin: (provider: 'twitter' | 'google' | 'reddit') => void;
  isLoading: boolean;
}

export const SocialLogin = ({ onSocialLogin, isLoading }: SocialLoginProps) => {
  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-luxury-primary/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-transparent text-luxury-neutral/80">or continue with</span>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin('google')}
          className="border-luxury-primary/20 bg-white/5 text-white hover:bg-luxury-primary/20 hover:border-luxury-primary/40 transition-all duration-300 w-14 h-14 rounded-full p-0 group"
          disabled={isLoading}
        >
          <span className="text-xl font-semibold group-hover:text-luxury-primary transition-colors">G</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin('twitter')}
          className="border-luxury-primary/20 bg-white/5 text-white hover:bg-luxury-primary/20 hover:border-luxury-primary/40 transition-all duration-300 w-14 h-14 rounded-full p-0 group"
          disabled={isLoading}
        >
          <span className="text-xl font-bold group-hover:text-luxury-primary transition-colors">X</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin('reddit')}
          className="border-luxury-primary/20 bg-white/5 text-white hover:bg-luxury-primary/20 hover:border-luxury-primary/40 transition-all duration-300 w-14 h-14 rounded-full p-0 group relative overflow-hidden"
          disabled={isLoading}
        >
          <div className="w-8 h-8 group-hover:text-luxury-primary transition-colors">
            <svg viewBox="0 0 20 20" className="fill-current">
              <g>
                <circle cx="10" cy="10" r="10"/>
                <path fill="white" d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23A1.46,1.46,0,1,0,4.2,11.33a2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Zm-10,1a1,1,0,1,1,1,1A1,1,0,0,1,6.67,11Zm5.81,2.75a3.84,3.84,0,0,1-2.47.77,3.84,3.84,0,0,1-2.47-.77,0.27,0.27,0,0,1,.38-0.38A3.27,3.27,0,0,0,10,14a3.28,3.28,0,0,0,2.09-.61A0.27,0.27,0,1,1,12.48,13.79Zm-0.18-1.71a1,1,0,1,1,1-1A1,1,0,0,1,12.29,12.08Z"/>
              </g>
            </svg>
          </div>
        </Button>
      </div>
    </div>
  );
};