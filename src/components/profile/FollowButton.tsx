
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FollowButtonProps {
  isFollowing: boolean;
  isLoading?: boolean;
  onFollow?: () => Promise<void>;
  onUnfollow?: () => Promise<void>;
}

export const FollowButton = ({ 
  isFollowing, 
  isLoading = false,
  onFollow,
  onUnfollow 
}: FollowButtonProps) => {
  const [hovered, setHovered] = useState(false);
  
  const handleClick = async () => {
    if (isFollowing) {
      onUnfollow && await onUnfollow();
    } else {
      onFollow && await onFollow();
    }
  };
  
  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isLoading ? (
        "Loading..."
      ) : isFollowing ? (
        hovered ? "Unfollow" : "Following"
      ) : (
        "Follow"
      )}
    </Button>
  );
};
