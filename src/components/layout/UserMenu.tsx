
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({ description: "Signed out successfully" });
  };

  const handleProfileClick = () => {
    if (session?.user) {
      // Get username from user metadata or use email prefix
      const username = session.user.user_metadata?.username || 
                      session.user.email?.split('@')[0] || 
                      `user_${session.user.id.slice(0, 8)}`;
      navigate(`/profile/${username}`);
      setIsOpen(false);
    }
  };

  if (!session?.user) return null;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="text-white text-sm font-medium hidden md:inline">
          {session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'Profile'}
        </span>
        <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50"
          >
            <div className="p-2">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  navigate('/settings');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <hr className="my-2 border-white/10" />
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
