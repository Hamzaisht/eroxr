
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "@supabase/auth-helpers-react";
import { CreateBodyContactDialog } from "@/components/ads/CreateBodyContactDialog";
import { NewMessageDialog } from "@/components/messages/NewMessageDialog";

interface DatingHeaderProps {
  isNewMessageOpen: boolean;
  setIsNewMessageOpen: (isOpen: boolean) => void;
  canAccessBodyContact: boolean;
  onAdCreationSuccess: () => void;
}

export const DatingHeader = ({ 
  isNewMessageOpen, 
  setIsNewMessageOpen, 
  canAccessBodyContact, 
  onAdCreationSuccess 
}: DatingHeaderProps) => {
  const session = useSession();
  const navigate = useNavigate();

  return (
    <>
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-neon-glow opacity-20 blur-xl"></div>
        <div className="relative glass-effect p-8 rounded-2xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
                Discover Connections
              </h1>
              <p className="text-luxury-neutral text-lg">
                Find your perfect match through authentic video profiles
              </p>
            </div>
            <div className="flex gap-3">
              {!session?.user ? (
                <Button 
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
                >
                  Login to Create
                </Button>
              ) : !canAccessBodyContact ? (
                <Button 
                  onClick={() => navigate('/subscription')}
                  className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
                >
                  Upgrade to Create
                </Button>
              ) : (
                <CreateBodyContactDialog onSuccess={onAdCreationSuccess} />
              )}
              <NewMessageDialog 
                open={isNewMessageOpen} 
                onOpenChange={setIsNewMessageOpen} 
                onSelectUser={() => {}} 
              />
            </div>
          </div>
        </div>
      </div>

      {!session?.user && (
        <Alert className="bg-luxury-dark/70 backdrop-blur-sm border-luxury-primary/20">
          <Info className="h-4 w-4 text-luxury-primary" />
          <AlertDescription className="text-luxury-neutral">
            Sign in to create your own profile and connect with others
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
