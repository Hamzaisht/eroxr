
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface UserProfileSectionProps {
  isExpanded: boolean;
  currentUser?: any;
}

export const UserProfileSection = ({ isExpanded, currentUser }: UserProfileSectionProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const goToProfile = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  const goToSettings = () => {
    navigate("/settings");
    setShowDropdown(false);
  };

  if (!currentUser) return null;

  return (
    <div className="relative mt-auto p-4">
      <motion.div
        className={cn(
          "flex items-center gap-3 p-3 rounded-2xl cursor-pointer",
          "bg-slate-800/30 hover:bg-slate-700/40 transition-all duration-200",
          "border border-slate-700/20 backdrop-blur-sm"
        )}
        onClick={() => setShowDropdown(!showDropdown)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Avatar className="w-10 h-10 border-2 border-slate-600/30">
          <AvatarImage 
            src={currentUser?.avatar_url} 
            alt={currentUser?.username || "User"} 
          />
          <AvatarFallback className="bg-gradient-to-br from-slate-600 to-gray-600 text-slate-200">
            {currentUser?.username?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex flex-col overflow-hidden"
            >
              <span className="text-slate-200 font-medium truncate text-sm">
                {currentUser?.username || "User"}
              </span>
              <span className="text-slate-400 text-xs truncate">
                Divine Creator
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={cn(
              "absolute bottom-full left-4 right-4 mb-2 z-50",
              "bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/30",
              "shadow-2xl overflow-hidden"
            )}
          >
            <div className="p-2 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-200 hover:bg-slate-700/50 rounded-xl"
                onClick={goToProfile}
              >
                <Crown className="w-4 h-4 mr-3" />
                Divine Studio
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-200 hover:bg-slate-700/50 rounded-xl"
                onClick={goToSettings}
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
              
              <div className="border-t border-slate-700/30 my-1" />
              
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-400 hover:bg-slate-700/50 hover:text-red-400 rounded-xl"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
