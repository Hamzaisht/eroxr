
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { ProfileHeaderProps } from "../types";

export const ProfileHeaderActions = ({ 
  profile, 
  isOwnProfile,
  isEditing,
  setIsEditing
}: ProfileHeaderProps) => {
  const [isFollowing, setIsFollowing] = useState(false);

  if (isOwnProfile) {
    return (
      <div className="flex items-center gap-2">
        {isEditing ? (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing?.(false)}
          >
            Cancel
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setIsEditing?.(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant={isFollowing ? "outline" : "default"} 
        size="sm"
        onClick={() => setIsFollowing(!isFollowing)}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
      <Button variant="outline" size="sm">
        Message
      </Button>
    </div>
  );
};
