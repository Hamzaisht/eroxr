import { Button } from "@/components/ui/button";

interface GuestButtonsProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export const GuestButtons = ({ onLogin, onSignUp }: GuestButtonsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        onClick={onLogin}
        className="hover:bg-luxury-neutral/10 transition-all duration-300"
      >
        Log in
      </Button>
      <Button 
        onClick={onSignUp}
        className="bg-button-gradient hover:bg-hover-gradient text-white transition-all duration-300 hover:scale-105"
      >
        Sign up
      </Button>
    </div>
  );
};