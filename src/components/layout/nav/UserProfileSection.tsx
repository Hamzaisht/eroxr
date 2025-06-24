
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Settings, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfileSectionProps {
  isExpanded: boolean;
  currentUser?: any;
}

export const UserProfileSection = ({ isExpanded, currentUser }: UserProfileSectionProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleProfileClick = () => {
    navigate('/new-profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <motion.div
      className="mt-auto p-4 border-t border-slate-700/30"
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-8 h-8 border border-slate-600/30">
          <AvatarImage 
            src={currentUser?.avatar_url} 
            alt={currentUser?.username || 'User'} 
          />
          <AvatarFallback className="bg-slate-700 text-slate-200">
            {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        {isExpanded && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">
              {currentUser?.username || 'User'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {currentUser?.bio || 'No bio yet'}
            </p>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-2">
          <Button
            onClick={handleProfileClick}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/50"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          
          <Button
            onClick={handleSettingsClick}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-300 hover:text-red-400 hover:bg-slate-800/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )}
    </motion.div>
  );
};
