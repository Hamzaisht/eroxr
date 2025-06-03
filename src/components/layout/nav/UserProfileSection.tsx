
import { Link } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface UserProfileSectionProps {
  isExpanded: boolean;
  currentUser?: any;
}

export const UserProfileSection = ({ isExpanded, currentUser }: UserProfileSectionProps) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (session?.user) {
      const username = 
        currentUser?.username || 
        session.user.user_metadata?.username || 
        session.user.email?.split('@')[0] || 
        `user_${session.user.id.slice(0, 8)}`;
        
      navigate(`/profile/${username}`);
      setIsMenuOpen(false);
    }
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setIsMenuOpen(false);
  };

  if (!session) return null;

  return (
    <div className="mt-auto px-3">
      <div className="border-t border-luxury-primary/10 pt-4 mt-4">
        <div className="relative">
          <div 
            className={`flex items-center gap-3 py-2 px-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors duration-300 ${isMenuOpen ? 'bg-white/5' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-white" />
            </div>
            
            {isExpanded && (
              <div className="flex-1 overflow-hidden">
                <p className="text-white text-sm font-medium truncate">
                  {currentUser?.username || 
                   session.user.user_metadata?.username || 
                   session.user.email?.split('@')[0] || 
                   'Profile'}
                </p>
                <p className="text-white/50 text-xs truncate">
                  {session.user.email}
                </p>
              </div>
            )}
          </div>

          {isMenuOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-full bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl">
              <button
                onClick={handleProfileClick}
                className="w-full text-left flex items-center gap-3 px-3 py-3 text-white hover:bg-white/10 transition-colors"
              >
                <UserIcon className="h-4 w-4" />
                <span>My Profile</span>
              </button>
              <button
                onClick={handleSettingsClick}
                className="w-full text-left flex items-center gap-3 px-3 py-3 text-white hover:bg-white/10 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
              <div className="border-t border-white/10"></div>
              <button
                onClick={handleSignOut}
                className="w-full text-left flex items-center gap-3 px-3 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
