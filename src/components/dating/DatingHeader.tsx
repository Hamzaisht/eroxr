
import { Button } from "@/components/ui/button";
import { MessageCircle, User, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { CreateBodyContactDialog } from "@/components/ads/body-contact/CreateBodyContactDialog";

interface DatingHeaderProps {
  canAccessBodyContact: boolean;
  onAdCreationSuccess: () => void;
  isSticky?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const DatingHeader = ({
  canAccessBodyContact,
  onAdCreationSuccess,
  isSticky = false,
  activeTab = "browse",
  onTabChange,
}: DatingHeaderProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  useEffect(() => {
    setUnreadMessages(Math.floor(Math.random() * 5));
  }, []);

  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  const handleIconClick = (route: string) => {
    navigate(route);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative w-full ${isSticky
        ? "py-3 px-4"
        : "mb-6"
      }`}
    >
      {/* Glass blur/gradient background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="w-full h-full glass-morph-from-glow"
        />
        {/* Animated gradient ring */}
        <div className="absolute -inset-2 rounded-3xl z-[-1] bg-gradient-to-r from-luxury-primary/40 via-luxury-accent/30 to-luxury-primary/40 animate-glow-move opacity-60 blur-[6px]" />
      </div>
      {/* Header main content */}
      <div className="relative z-10 flex flex-col space-y-4 pt-2 pb-2 px-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              {/* Animated Sparkles Icon */}
              <Sparkles className="h-7 w-7 text-luxury-accent animate-spin-slow drop-shadow-lg" />
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-primary bg-clip-text text-transparent animate-text-move tracking-tight neon-text-shadow drop-shadow-[0_2px_30px_#9b87f5]">
                Body Dating
              </h1>
            </div>
            <p className="text-md font-medium text-luxury-neutral/90 mt-1 neon-blur-text flex items-center gap-2 animate-fade-in">
              <span className="relative inline-block">
                Find your perfect match in the Nordic region
                <span className="absolute left-0 bottom-[-4px] h-0.5 w-full neon-underline-gradient rounded-full" aria-hidden />
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {session ? (
              <>
                {/* Messages button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="relative bg-luxury-dark/60 border border-luxury-primary/40 shadow-neon hover:shadow-neon-lg transition-all ring-1 ring-luxury-primary/20"
                  onClick={() => handleIconClick("/messages")}
                  aria-label="Messages"
                >
                  <MessageCircle className="h-5 w-5 text-luxury-primary drop-shadow-glow" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-luxury-primary/90 text-black text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadMessages}
                    </span>
                  )}
                </Button>

                {/* Profile button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-luxury-dark/60 border border-luxury-primary/40 hover:shadow-neon-lg transition-all shadow-neon ring-1 ring-luxury-primary/20"
                  onClick={() => handleIconClick("/profile")}
                  aria-label="Profile"
                >
                  <User className="h-5 w-5 text-luxury-primary drop-shadow-glow" />
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white shadow-neon hover:shadow-neon-lg"
              >
                Sign In
              </Button>
            )}
            <CreateBodyContactDialog onSuccess={onAdCreationSuccess} />
          </div>
        </div>

        {/* Neon underline */}
        <div className="mt-0.5 h-[2px] w-full bg-gradient-to-r from-luxury-accent via-luxury-primary/80 to-luxury-accent rounded-full opacity-80 animate-shine" />

        {/* Futuristic tabs */}
        <div className="w-full max-w-md mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 glass-morph-from-glow ring-1 ring-luxury-primary/20 backdrop-blur-[5px] shadow-xl">
              <TabsTrigger value="browse" className="neon-tab">
                Browse
              </TabsTrigger>
              <TabsTrigger value="quick-match" className="neon-tab">
                Quick Match
              </TabsTrigger>
              <TabsTrigger value="favorites" className="neon-tab">
                Favorites
              </TabsTrigger>
              <TabsTrigger value="nearby" className="neon-tab">
                Nearby
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};
