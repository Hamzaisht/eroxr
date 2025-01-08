import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export const NavButtons = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleJoinNow = () => {
    if (session) {
      navigate("/home");
    } else {
      navigate("/login");
      toast({
        title: "Welcome!",
        description: "Create your account to get started.",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        className="relative px-6 py-2 text-luxury-neutral hover:text-white group overflow-hidden"
        onClick={handleLogin}
      >
        <span className="relative z-10">Log in</span>
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary/10 to-luxury-accent/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </Button>
      <Button 
        className="relative px-8 py-2 bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-luxury group"
        onClick={handleJoinNow}
      >
        <span className="relative z-10 flex items-center gap-2">
          Join Now
          <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </span>
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
      </Button>
    </div>
  );
};