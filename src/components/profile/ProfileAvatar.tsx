import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProfileAvatarProps {
  profile: any;
  getMediaType: (url: string) => 'video' | 'gif' | 'image';
}

export const ProfileAvatar = ({ profile, getMediaType }: ProfileAvatarProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="relative group">
      <Avatar className="h-48 w-48 border-4 border-background shadow-xl rounded-3xl overflow-hidden">
        {getMediaType(profile?.avatar_url) === 'video' ? (
          <video
            src={profile?.avatar_url}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            autoPlay={isHovering}
            loop
            muted
            playsInline
          />
        ) : (
          <AvatarImage 
            src={profile?.avatar_url} 
            className="group-hover:scale-105 transition-transform duration-500" 
          />
        )}
        <AvatarFallback className="text-4xl bg-luxury-primary text-white">
          {profile?.username?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      
      {/* Subtle hover effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl backdrop-blur-[2px] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          whileHover={{ scale: 1.1 }}
          className="text-white"
        >
          <Sparkles className="w-8 h-8 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};