import { Phone, Video, MoreVertical, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
}

interface ChatHeaderProps {
  userProfile: UserProfile | null;
  onBookingClick: () => void;
}

export const ChatHeader = ({ userProfile, onBookingClick }: ChatHeaderProps) => {
  return (
    <motion.div 
      className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02] backdrop-blur-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-white/20 shadow-lg shadow-primary/20">
            <AvatarImage src={userProfile?.avatar_url || ""} alt={userProfile?.username} />
            <AvatarFallback className="bg-gradient-to-br from-primary/30 to-purple-500/30 text-white font-semibold">
              {userProfile?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {/* Neural activity indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black/50 animate-pulse shadow-lg shadow-green-400/50" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400/30 rounded-full animate-ping" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{userProfile?.username || 'Unknown User'}</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-sm text-green-400/80 font-medium">Online</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={onBookingClick}
          className="group relative overflow-hidden p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Calendar className="h-4 w-4 text-white/70 group-hover:text-white relative z-10" />
        </button>
        <button className="group relative overflow-hidden p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Phone className="h-4 w-4 text-white/70 group-hover:text-white relative z-10" />
        </button>
        <button className="group relative overflow-hidden p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Video className="h-4 w-4 text-white/70 group-hover:text-white relative z-10" />
        </button>
        <button className="group relative overflow-hidden p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <MoreVertical className="h-4 w-4 text-white/70 group-hover:text-white relative z-10" />
        </button>
      </div>
    </motion.div>
  );
};