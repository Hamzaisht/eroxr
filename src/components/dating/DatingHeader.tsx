
import { Button } from "@/components/ui/button";
import { MessageCircle, User, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";

interface DatingHeaderProps {
  isNewMessageOpen: boolean;
  setIsNewMessageOpen: (open: boolean) => void;
  canAccessBodyContact: boolean;
  onAdCreationSuccess: () => void;
  isSticky?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const DatingHeader = ({
  isNewMessageOpen,
  setIsNewMessageOpen,
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
    // Simulate fetching for unread messages count
    setUnreadMessages(Math.floor(Math.random() * 5));
  }, []);

  const handleCreateBodyContact = () => {
    if (!session) {
      navigate("/auth");
      return;
    }
    setIsNewMessageOpen(true);
  };

  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  // Handler for header icon buttons with correct routing
  const handleIconClick = (route: string) => {
    navigate(route);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full ${isSticky
            ? "bg-luxury-dark/80 backdrop-blur-lg border-b border-luxury-primary/10 py-3 px-4"
            : "mb-6"
          }`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Body Dating
            </h1>
            <p className="text-sm text-luxury-neutral">
              Find your perfect match in the Nordic region
            </p>
          </div>

          <div className="flex items-center gap-2">
            {session ? (
              <>
                {/* ONLY Messages and Profile left */}
                <Button
                  variant="outline"
                  size="icon"
                  className="relative bg-luxury-dark/50 border-luxury-primary/20"
                  onClick={() => handleIconClick("/messages")}
                  aria-label="Messages"
                >
                  <MessageCircle className="h-5 w-5 text-luxury-primary" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-luxury-primary text-black text-xs rounded-full flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="bg-luxury-dark/50 border-luxury-primary/20"
                  onClick={() => handleIconClick("/profile")}
                  aria-label="Profile"
                >
                  <User className="h-5 w-5 text-luxury-primary" />
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
              >
                Sign In
              </Button>
            )}
            <Button
              onClick={handleCreateBodyContact}
              className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your Body Contact Ad
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full max-w-md mx-auto"
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="quick-match">Quick Match</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </motion.div>
  );
};
