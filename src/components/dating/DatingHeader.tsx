
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bell, User, Plus } from "lucide-react";
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
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);

  useEffect(() => {
    // For demo purposes, set some random numbers for unread items
    setUnreadMessages(Math.floor(Math.random() * 5));
    setUnreadNotifications(Math.floor(Math.random() * 3));
    
    // In a real app, we would fetch these counts from the database
    // based on the current user's session
  }, []);

  const handleCreateProfile = () => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full ${
        isSticky
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
                <Button
                  variant="outline"
                  size="icon"
                  className="relative bg-luxury-dark/50 border-luxury-primary/20"
                  onClick={() => navigate("/dating/favorites")}
                >
                  <Heart className="h-5 w-5 text-luxury-primary" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-luxury-primary text-black text-xs rounded-full flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative bg-luxury-dark/50 border-luxury-primary/20"
                  onClick={() => navigate("/messages")}
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
                  className="relative bg-luxury-dark/50 border-luxury-primary/20"
                  onClick={() => navigate("/notifications")}
                >
                  <Bell className="h-5 w-5 text-luxury-primary" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-luxury-primary text-black text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-luxury-dark/50 border-luxury-primary/20"
                  onClick={() => navigate("/profile")}
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
              onClick={handleCreateProfile}
              className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Profile
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
