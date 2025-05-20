
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface LikeButtonProps {
  initialLiked?: boolean;
  onLike?: (liked: boolean) => void;
  disabled?: boolean;
}

export const LikeButton = ({ initialLiked = false, onLike, disabled }: LikeButtonProps) => {
  const [liked, setLiked] = useState(initialLiked);
  
  const handleClick = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    onLike?.(newLikedState);
  };
  
  return (
    <Button 
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={disabled}
      className={`${
        liked 
          ? "bg-red-500/20 hover:bg-red-500/30 text-red-500" 
          : "bg-gray-500/20 hover:bg-gray-500/30 text-gray-300"
      } h-8`}
    >
      <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-red-500" : ""}`} />
      <span>{liked ? "Unlike" : "Like"}</span>
    </Button>
  );
};
