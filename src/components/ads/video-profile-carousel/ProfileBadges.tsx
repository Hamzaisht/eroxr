
import { Badge } from "@/components/ui/badge";
import { DatingAd } from "@/types/dating";
import { CheckCircle, Star } from "lucide-react";

export interface ProfileBadgesProps {
  ad: DatingAd;
}

export const ProfileBadges = ({ ad }: ProfileBadgesProps) => {
  // Use either is_verified or isVerified property
  const isVerified = ad.is_verified !== undefined ? ad.is_verified : ad.isVerified;
  
  // Use either is_premium or isPremium property
  const isPremium = ad.is_premium !== undefined ? ad.is_premium : ad.isPremium;
  
  return (
    <div className="flex space-x-2 mb-2">
      {isVerified && (
        <Badge variant="outline" className="bg-green-500/20 border-green-500 text-white flex items-center gap-1 px-2">
          <CheckCircle className="h-3 w-3" />
          <span>Verified</span>
        </Badge>
      )}
      
      {isPremium && (
        <Badge variant="outline" className="bg-amber-500/20 border-amber-500 text-white flex items-center gap-1 px-2">
          <Star className="h-3 w-3" />
          <span>Premium</span>
        </Badge>
      )}
    </div>
  );
};
