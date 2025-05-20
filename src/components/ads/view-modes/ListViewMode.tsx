
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAgeRangeValues } from "@/utils/dating/ageRangeUtils";
import { VerifiedBadge } from "../badges/VerifiedBadge";
import { PremiumBadge } from "../badges/PremiumBadge";
import { DistanceBadge } from "../badges/DistanceBadge";
import { MessageButton } from "../buttons/MessageButton";
import { LikeButton } from "../buttons/LikeButton";
import { ViewButton } from "../buttons/ViewButton";
import { DatingAd } from "../types/dating";

export interface ListViewModeProps {
  ads: DatingAd[];
  isLoading?: boolean;
  userProfile?: DatingAd | null;
  onViewProfile?: (ad: DatingAd) => void;
  onLikeProfile?: (ad: DatingAd, liked: boolean) => void;
  onMessageProfile?: (ad: DatingAd) => void;
}

export const ListViewMode = ({ 
  ads, 
  isLoading = false, 
  userProfile = null,
  onViewProfile,
  onLikeProfile,
  onMessageProfile
}: ListViewModeProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary"></div>
      </div>
    );
  }
  
  if (!ads || ads.length === 0) {
    return (
      <div className="text-center py-10 bg-luxury-darker/30 rounded-lg border border-luxury-primary/10">
        <p className="text-luxury-neutral">No profiles found matching your criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {ads.map((ad) => {
        const ageRange = getAgeRangeValues(ad.age_range);
        
        return (
          <div 
            key={ad.id} 
            className="flex bg-luxury-darker/50 backdrop-blur-sm border border-luxury-primary/10 rounded-xl overflow-hidden hover:border-luxury-primary/30 transition-all"
          >
            <div className="w-48 h-48 bg-luxury-darker overflow-hidden flex-shrink-0">
              <img 
                src={ad.avatarUrl || ad.avatar_url || "https://via.placeholder.com/200"} 
                alt={ad.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4 flex-1">
              <div className="flex flex-col h-full">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-medium text-white">{ad.title || ad.username}</h3>
                    <p className="text-sm text-luxury-neutral mt-1">{ad.location || `${ad.city || ''}, ${ad.country || ''}`}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {(ad.isVerified || ad.is_verified) && <VerifiedBadge />}
                    {(ad.isPremium || ad.is_premium) && <PremiumBadge />}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-luxury-primary/10 text-luxury-primary/90 text-xs px-2 py-0.5 rounded-full">
                    {ageRange.lower}-{ageRange.upper} years
                  </span>
                  
                  <DistanceBadge distance={10} />
                  
                  {ad.relationship_status && (
                    <span className="bg-luxury-primary/10 text-luxury-primary/90 text-xs px-2 py-0.5 rounded-full">
                      {ad.relationship_status}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-luxury-neutral/80 mt-3 line-clamp-2">
                  {ad.description || "No description provided."}
                </p>
                
                {ad.tags && ad.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {ad.tags.slice(0, 5).map((tag) => (
                      <span key={tag} className="bg-luxury-primary/5 text-luxury-neutral text-xs px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                    {ad.tags.length > 5 && (
                      <span className="bg-luxury-primary/5 text-luxury-neutral/60 text-xs px-2 py-0.5 rounded-full">
                        +{ad.tags.length - 5} more
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2 mt-auto pt-3">
                  <ViewButton onClick={() => onViewProfile?.(ad)} />
                  <LikeButton onLike={(liked) => onLikeProfile?.(ad, liked)} />
                  <MessageButton onClick={() => onMessageProfile?.(ad)} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
