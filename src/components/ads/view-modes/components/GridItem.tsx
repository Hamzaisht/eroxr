
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { AdActions } from "../../video-profile-card/AdActions";
import { MapPin, MessageCircle, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getPlayableMediaUrl } from "@/utils/media/getPlayableMediaUrl";
import type { GridItemProps } from "../types";

export const GridItem = ({ 
  ad, 
  isHovered, 
  onHover, 
  onSelect, 
  onMediaClick, 
  onTagClick,
  isMobile 
}: GridItemProps) => {
  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onTagClick?.(tag, e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      transition={{ duration: 0.2 }}
      className="bg-luxury-dark/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-luxury-primary/10 cursor-pointer group relative flex flex-col"
      onClick={() => onSelect(ad)}
      onMouseEnter={() => !isMobile && onHover(ad.id)}
      onMouseLeave={() => !isMobile && onHover(null)}
      onTouchStart={() => isMobile && onHover(isHovered ? null : ad.id)}
    >
      <AdActions ad={ad} />
      
      <div className="aspect-video w-full relative">
        <VideoThumbnail 
          videoUrl={ad.video_url} 
          isHovered={isHovered}
          isMobile={isMobile}
        />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute inset-0 z-20 opacity-0" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to view full ad</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-luxury-primary/30">
              <AvatarImage src={ad.avatar_url || undefined} />
              <AvatarFallback className="bg-luxury-darker text-luxury-neutral">
                {ad.user?.username?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm text-white truncate max-w-[150px]">{ad.title}</h3>
              <p className="text-xs text-luxury-neutral">{ad.user?.username || "Anonymous"}</p>
            </div>
          </div>
          <div className="text-xs text-luxury-neutral flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-[80px]">{ad.city}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-luxury-neutral/80 mt-3">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{ad.view_count || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            <span>{ad.message_count || 0}</span>
          </div>
        </div>
        
        {ad.tags && ad.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {ad.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="bg-luxury-darker/50 text-[10px] cursor-pointer hover:bg-luxury-primary/20"
                onClick={(e) => handleTagClick(tag, e)}
              >
                {tag}
              </Badge>
            ))}
            {ad.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="bg-luxury-darker/50 text-[10px]"
              >
                +{ad.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
