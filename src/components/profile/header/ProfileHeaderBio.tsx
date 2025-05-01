
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { ProfileHeaderProps } from "../types";

export const ProfileHeaderBio = ({ 
  profile, 
  isOwnProfile, 
  isEditing,
  showFullBio,
  setShowFullBio
}: ProfileHeaderProps & { 
  showFullBio: boolean;
  setShowFullBio: (show: boolean) => void;
}) => {
  const bio = profile?.bio || "No bio yet";
  const MAX_BIO_LENGTH = 150;
  const shouldTruncate = bio.length > MAX_BIO_LENGTH && !showFullBio;

  return (
    <div className="space-y-2">
      <p className="text-luxury-neutral/80 text-sm">
        {shouldTruncate ? `${bio.substring(0, MAX_BIO_LENGTH)}...` : bio}
      </p>

      {bio.length > MAX_BIO_LENGTH && (
        <Button 
          variant="link" 
          size="sm" 
          className="p-0 h-auto text-luxury-primary"
          onClick={() => setShowFullBio(!showFullBio)}
        >
          {showFullBio ? "Show less" : "Read more"}
        </Button>
      )}
    </div>
  );
};
