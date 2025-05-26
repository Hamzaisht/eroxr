
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface EroboardCardProps {
  videoUrl?: string;
  title: string;
  creator: {
    username: string;
    avatarUrl?: string;
  };
  isLiked?: boolean;
  likesCount: number;
  commentsCount: number;
  isPremium?: boolean;
  isVerified?: boolean;
  tags?: string[];
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  className?: string;
}

export const EroboardCard = ({
  videoUrl,
  title,
  creator,
  isLiked = false,
  likesCount = 0,
  commentsCount = 0,
  isPremium = false,
  isVerified = false,
  tags = [],
  onLike,
  onComment,
  onShare,
  className
}: EroboardCardProps) => {
  return (
    <Card className={cn("overflow-hidden bg-luxury-darker border-luxury-neutral/20", className)}>
      <div className="relative aspect-video bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayCircle className="w-16 h-16 text-white/60" />
        </div>
        <div className="absolute bottom-2 right-2">
          {isPremium && (
            <Badge variant="secondary" className="bg-luxury-primary/80">
              Premium
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-luxury-neutral/20 overflow-hidden">
            {creator.avatarUrl ? (
              <img 
                src={creator.avatarUrl} 
                alt={creator.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-luxury-neutral text-sm">
                  {creator.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-luxury-text truncate">{title}</h3>
            <div className="flex items-center gap-1">
              <span className="text-sm text-luxury-neutral">{creator.username}</span>
              {isVerified && (
                <span className="text-luxury-primary">✓</span>
              )}
            </div>
          </div>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className={cn(
                "flex items-center gap-1 px-2",
                isLiked && "text-red-500"
              )}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              <span className="text-sm">{likesCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onComment}
              className="flex items-center gap-1 px-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{commentsCount}</span>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
