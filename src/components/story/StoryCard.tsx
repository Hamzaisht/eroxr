
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface StoryCardProps {
  storyId: string;
  creatorId: string;
  mediaUrl?: string;
  videoUrl?: string;
  username?: string;
  avatarUrl?: string;
  createdAt: string;
  onClick?: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  storyId,
  creatorId,
  mediaUrl,
  videoUrl,
  username,
  avatarUrl,
  createdAt,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="relative flex-shrink-0 cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={cn(
          "flex flex-col items-center gap-1 transition-all duration-200",
          isHovered ? "scale-105" : ""
        )}
      >
        {/* Avatar with colored ring */}
        <div className="relative p-[2px] rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
          <Avatar className="h-14 w-14 border-2 border-background">
            <AvatarImage src={avatarUrl} alt={username || "User"} />
            <AvatarFallback>
              {username?.slice(0, 2).toUpperCase() || "UN"}
            </AvatarFallback>
          </Avatar>
          
          {/* Indicator dot for new stories */}
          <div className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
        </div>
        
        {/* Username */}
        <span className="text-xs font-medium mt-1 max-w-[70px] truncate text-center">
          {username || "User"}
        </span>
      </div>
    </div>
  );
};
