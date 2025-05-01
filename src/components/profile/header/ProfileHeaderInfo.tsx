
import { MapPin } from "lucide-react";
import type { ProfileHeaderProps } from "../types";

export const ProfileHeaderInfo = ({ 
  profile, 
  isOwnProfile, 
  isEditing 
}: ProfileHeaderProps) => {
  return (
    <div className="flex items-center flex-wrap gap-4">
      {profile?.location && (
        <div className="flex items-center gap-1 text-sm text-luxury-neutral/70">
          <MapPin className="h-3 w-3" />
          <span>{profile.location}</span>
        </div>
      )}

      {profile?.interests && profile.interests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest, i) => (
            <span 
              key={i} 
              className="text-xs bg-luxury-primary/10 text-luxury-primary px-2 py-0.5 rounded-full"
            >
              {interest}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
