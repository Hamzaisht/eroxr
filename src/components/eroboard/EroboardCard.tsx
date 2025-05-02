
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaItem } from "./types";
import { MediaType } from "@/utils/media/types";

interface EroboardCardProps {
  item: MediaItem;
  view: "grid" | "columns";
}

export const EroboardCard = ({ item, view }: EroboardCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likeCount);
  
  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const cardHeight = view === "grid" ? "h-[300px]" : "h-[400px]";
  const imageHeight = view === "grid" ? "h-[200px]" : "h-[300px]";

  return (
    <Card className="bg-luxury-darker/40 border-luxury-primary/10 overflow-hidden hover:border-luxury-primary/30 transition-all duration-300">
      <div className={`relative ${imageHeight} overflow-hidden`}>
        <UniversalMedia
          item={{
            media_url: item.type === "image" ? item.url : undefined,
            video_url: item.type === "video" ? item.url : undefined,
            thumbnail_url: item.thumbnail,
            media_type: item.type === "image" ? MediaType.IMAGE : MediaType.VIDEO
          }}
          className="w-full h-full object-cover"
          controls={item.type === "video"}
          muted={true}
          autoPlay={false}
        />
      </div>
      
      <CardContent className="p-4 pb-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={item.creator.avatar} />
              <AvatarFallback>{item.creator.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-luxury-neutral">{item.creator.name}</p>
            </div>
          </div>
        </div>
        
        <h3 className="font-semibold text-luxury-neutral truncate">{item.title}</h3>
      </CardContent>
      
      <CardFooter className="p-4 pt-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${isLiked ? 'text-red-500' : 'text-luxury-neutral/70'} hover:text-red-500`}
              onClick={handleLike}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <span className="text-sm text-luxury-neutral/70">{likeCount}</span>
            
            <Button variant="ghost" size="icon" className="text-luxury-neutral/70">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <span className="text-sm text-luxury-neutral/70">{item.commentCount}</span>
          </div>
          
          <Button variant="ghost" size="icon" className="text-luxury-neutral/70">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
