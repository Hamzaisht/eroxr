import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
// import { CreateBodyContactDialog } from "@/components/ads/body-contact"; // REMOVED - to be rebuilt

interface EmptyProfilesStateProps {
  canAccessBodyContact: boolean;
  onAdCreationSuccess: () => void;
}

export const EmptyProfilesState = ({ 
  canAccessBodyContact, 
  onAdCreationSuccess 
}: EmptyProfilesStateProps) => {
  const session = useSession();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] glass-effect rounded-2xl p-8 text-center space-y-4">
      <Sparkles className="w-12 h-12 text-luxury-primary animate-pulse" />
      <h3 className="text-2xl font-semibold text-white">No Profiles Found</h3>
      <p className="text-luxury-neutral max-w-md">
        {session?.user 
          ? canAccessBodyContact 
            ? "Be the first to create a profile in this category and start connecting with others" 
            : "Upgrade to a paying account to create your profile and connect with others"
          : "Sign in to see more profiles or create your own"
        }
      </p>
      {session?.user ? (
        canAccessBodyContact ? (
          <div>Create BD Ad Dialog - Coming Soon (to be rebuilt from scratch)</div>
        ) : (
          <Button 
            onClick={() => navigate('/subscription')}
            className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
          >
            Upgrade Now
          </Button>
        )
      ) : (
        <Button 
          onClick={() => navigate('/login')}
          className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
        >
          Sign In
        </Button>
      )}
    </div>
  );
};
