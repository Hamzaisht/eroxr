
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Info, Heart, MessageCircle, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "@supabase/auth-helpers-react";
import { CreateBodyContactDialog } from "@/components/ads/body-contact";
import { NewMessageDialog } from "@/components/messages/NewMessageDialog";

interface DatingHeaderProps {
  isNewMessageOpen: boolean;
  setIsNewMessageOpen: (isOpen: boolean) => void;
  canAccessBodyContact: boolean;
  onAdCreationSuccess: () => void;
  isSticky?: boolean;
}

export const DatingHeader = ({ 
  isNewMessageOpen, 
  setIsNewMessageOpen, 
  canAccessBodyContact, 
  onAdCreationSuccess,
  isSticky = false
}: DatingHeaderProps) => {
  const session = useSession();
  const navigate = useNavigate();

  return (
    <motion.div
      className={`${isSticky ? 'sticky top-0 z-30' : 'relative'} transition-all duration-300`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-neon-glow opacity-20 blur-xl"></div>
        <div className="relative glass-effect p-6 md:p-8 rounded-2xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
                Discover Connections
              </h1>
              <p className="text-luxury-neutral text-base md:text-lg max-w-md">
                Find your perfect match through authentic video profiles
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-end">
              {session?.user && (
                <div className="hidden md:flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-luxury-dark/50 border-luxury-primary/20 text-luxury-primary hover:bg-luxury-primary/10"
                    onClick={() => navigate('/favorites')}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-luxury-dark/50 border-luxury-primary/20 text-luxury-primary hover:bg-luxury-primary/10"
                    onClick={() => setIsNewMessageOpen(true)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Messages
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-luxury-dark/50 border-luxury-primary/20 text-luxury-primary hover:bg-luxury-primary/10"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Advanced Search
                  </Button>
                </div>
              )}
              
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
        <Alert className="mt-4 bg-luxury-dark/70 backdrop-blur-sm border-luxury-primary/20">
          <Info className="h-4 w-4 text-luxury-primary" />
          <AlertDescription className="text-luxury-neutral">
            Sign in to create your own profile and connect with others
          </AlertDescription>
        </Alert>
      )}
    </motion.div>
  );
};
