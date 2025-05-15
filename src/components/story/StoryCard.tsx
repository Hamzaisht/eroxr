
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { formatDistanceToNow } from "date-fns";

interface StoryCardProps {
  storyId: string;
  creatorId: string;
  mediaUrl?: string;
  videoUrl?: string;
  username?: string;
  avatarUrl?: string;
  createdAt: string;
}

export const StoryCard = ({
  storyId,
  creatorId,
  mediaUrl,
  videoUrl,
  username,
  avatarUrl,
  createdAt,
}: StoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format the time to a human-readable format
  const formattedTime = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  return (
    <motion.div
      className="flex-shrink-0 w-20 sm:w-24 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[9/16] rounded-lg overflow-hidden border border-white/10 mb-1 bg-black/30">
        {mediaUrl || videoUrl ? (
          <UniversalMedia
            item={{ url: mediaUrl || videoUrl || "", media_type: videoUrl ? "video" : "image" }}
            className="w-full h-full object-cover"
            autoPlay={isHovered}
            controls={false}
            muted={true}
            loop={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-pink-500/30">
            <span className="text-white/70 text-xs">No media</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center">
        <Avatar className="h-8 w-8 border border-white/20">
          <AvatarImage src={avatarUrl} alt={username || "User"} />
          <AvatarFallback className="text-xs">
            {username?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs mt-1 text-center text-white/80 truncate max-w-full">
          {username || "User"}
        </span>
      </div>
    </motion.div>
  );
};
