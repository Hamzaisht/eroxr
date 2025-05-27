
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export interface ErosItemProps {
  short: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    creatorId: string;
    likesCount: number;
    viewsCount: number;
    createdAt: string;
    creator: {
      id: string;
      username: string;
    };
  };
}

export const ErosItem = ({ short }: ErosItemProps) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    // Implement share functionality
    console.log("Share short:", short.id);
  };

  const handleComment = () => {
    // Implement comment functionality
    console.log("Comment on short:", short.id);
  };

  return (
    <Card className="bg-luxury-darker border-luxury-neutral/10 overflow-hidden">
      <div className="aspect-[9/16] bg-luxury-dark relative group cursor-pointer">
        {short.videoUrl ? (
          <video 
            className="w-full h-full object-cover"
            poster={short.thumbnailUrl}
            controls={false}
            muted
            loop
          >
            <source src={short.videoUrl} type="video/mp4" />
          </video>
        ) : short.thumbnailUrl ? (
          <img 
            src={short.thumbnailUrl} 
            alt={short.title}
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
              <AvatarFallback className="bg-luxury-primary text-white">
                {short.creator.username[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-white font-medium text-sm">
              @{short.creator.username}
            </span>
          </div>
          
          {short.title && (
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
              {short.title}
            </h3>
          )}
          
          {short.description && (
            <p className="text-white/80 text-xs line-clamp-2">
              {short.description}
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
            <span>{short.likesCount.toLocaleString()} likes</span>
            <span>{short.viewsCount.toLocaleString()} views</span>
          </div>
          <span>{new Date(short.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};
