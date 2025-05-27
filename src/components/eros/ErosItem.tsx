
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
    <Card className="bg-luxury-darker border-luxury-neutral/10 overflow-hidden">
      <div className="aspect-[9/16] bg-luxury-dark relative group cursor-pointer">
        {video.url ? (
          <video 
            className="w-full h-full object-cover"
            poster={video.thumbnailUrl}
            controls={false}
            muted
            loop
            autoPlay={isActive}
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
          <div className="w-full h-full flex items-center justify-center">
            <Play className="h-12 w-12 text-gray-500" />
          </div>
        )}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <Button size="lg" className="rounded-full bg-luxury-primary hover:bg-luxury-primary/90">
            <Play className="h-6 w-6" />
          </Button>
        </div>

        {/* Creator info overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage src={video.creator.avatarUrl} />
              <AvatarFallback className="bg-luxury-primary text-white">
                {video.creator.username[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-white font-medium text-sm">
              @{video.creator.username}
            </span>
          </div>
          
          {video.description && (
            <p className="text-white/80 text-xs line-clamp-2">
              {video.description}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-3">
          <Button
            size="sm"
            variant="ghost"
            className={`rounded-full bg-black/50 hover:bg-black/70 ${
              isLiked ? 'text-red-500' : 'text-white'
            }`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full bg-black/50 hover:bg-black/70 text-white"
            onClick={handleComment}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full bg-black/50 hover:bg-black/70 text-white"
            onClick={handleShare}
          >
            <Share className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span>{video.stats.likes.toLocaleString()} likes</span>
            <span>{video.stats.views.toLocaleString()} views</span>
          </div>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};
