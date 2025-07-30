
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { ErosVideo } from "@/types/eros";

export interface ErosItemProps {
  video: ErosVideo;
  isActive?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export const ErosItem = ({ video, isActive, onLike, onComment, onShare, onSave }: ErosItemProps) => {
  const [isLiked, setIsLiked] = useState(video.hasLiked || false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  const handleShare = () => {
    onShare?.();
  };

  const handleComment = () => {
    onComment?.();
  };

  const handleSave = () => {
    onSave?.();
  };

  return (
    <div className="w-full h-screen snap-start bg-black relative overflow-hidden">
      {/* Video/Media Content */}
      <div className="w-full h-full relative">
        {video.url ? (
          <video 
            className="w-full h-full object-cover"
            poster={video.thumbnailUrl}
            controls={false}
            muted
            loop
            autoPlay={isActive}
            playsInline
          >
            <source src={video.url} type="video/mp4" />
          </video>
        ) : video.thumbnailUrl ? (
          <img 
            src={video.thumbnailUrl} 
            alt={video.description || 'Video'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <Play className="h-16 w-16 text-white/60" />
          </div>
        )}
        
        {/* Mobile-optimized overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Creator info - Mobile optimized */}
        <div className="absolute bottom-20 md:bottom-6 left-4 right-20 md:right-24 z-10">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10 md:h-8 md:w-8 border-2 border-white/80">
              <AvatarImage src={video.creator.avatarUrl} />
              <AvatarFallback className="bg-luxury-primary text-white text-sm">
                {video.creator.username[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-white font-semibold text-base md:text-sm">
              @{video.creator.username}
            </span>
          </div>
          
          {video.description && (
            <p className="text-white/90 text-sm md:text-xs line-clamp-3 max-w-[280px] md:max-w-none">
              {video.description}
            </p>
          )}
          
          {/* Stats for mobile */}
          <div className="flex items-center gap-4 mt-3 text-white/80 text-sm md:hidden">
            <span>{video.stats.likes.toLocaleString()} likes</span>
            <span>{video.stats.views.toLocaleString()} views</span>
          </div>
        </div>

        {/* Action buttons - Mobile optimized */}
        <div className="absolute bottom-24 md:bottom-12 right-4 flex flex-col gap-4 z-10">
          <Button
            size="lg"
            variant="ghost"
            className={`rounded-full bg-black/50 hover:bg-black/70 p-3 md:p-2 ${
              isLiked ? 'text-red-500' : 'text-white'
            }`}
            onClick={handleLike}
          >
            <Heart className={`h-6 w-6 md:h-5 md:w-5 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            className="rounded-full bg-black/50 hover:bg-black/70 text-white p-3 md:p-2"
            onClick={handleComment}
          >
            <MessageCircle className="h-6 w-6 md:h-5 md:w-5" />
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            className="rounded-full bg-black/50 hover:bg-black/70 text-white p-3 md:p-2"
            onClick={handleShare}
          >
            <Share className="h-6 w-6 md:h-5 md:w-5" />
          </Button>
          
          {/* Like count display */}
          <div className="text-white/80 text-xs text-center mt-1">
            {video.stats.likes > 0 && (
              <span>{video.stats.likes > 999 ? `${Math.floor(video.stats.likes / 1000)}k` : video.stats.likes}</span>
            )}
          </div>
        </div>

        {/* Desktop stats */}
        <div className="hidden md:block absolute bottom-4 left-4 right-24">
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span>{video.stats.likes.toLocaleString()} likes</span>
            <span>{video.stats.views.toLocaleString()} views</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
