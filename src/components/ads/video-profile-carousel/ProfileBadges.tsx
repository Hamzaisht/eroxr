
import { Shield, Award } from "lucide-react";

interface ProfileBadgesProps {
  isPremium: boolean;
  isVerified: boolean;
}

export const ProfileBadges = ({ isPremium, isVerified }: ProfileBadgesProps) => {
  return (
    <div className="absolute top-4 right-4 flex space-x-2">
      {isVerified && (
        <div className="bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Shield className="h-3 w-3" />
          <span>Verified</span>
        </div>
      )}
      
      {isPremium && (
        <div className="bg-luxury-primary/20 text-luxury-primary text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Award className="h-3 w-3" />
          <span>Premium</span>
        </div>
      )}
    </div>
  );
};
