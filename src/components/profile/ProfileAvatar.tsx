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
      <Avatar 
        className="h-48 w-48 shadow-2xl rounded-3xl overflow-hidden bg-luxury-dark/40 ring-1 ring-luxury-primary/20"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
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
        <AvatarFallback className="text-4xl bg-luxury-dark text-luxury-primary">
          {profile?.username?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      
      {/* Refined hover effect with dark mode aesthetics */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl backdrop-blur-[1px] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          whileHover={{ scale: 1.1 }}
          className="text-luxury-primary"
        >
          <Sparkles className="w-8 h-8 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};