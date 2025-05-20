
import { DatingAd, getAgeRangeValues } from "@/types/dating"; 
import { VerifiedBadge } from "../badges/VerifiedBadge";
import { PremiumBadge } from "../badges/PremiumBadge";
import { DistanceBadge } from "../badges/DistanceBadge";
import { MessageButton } from "../buttons/MessageButton";
import { LikeButton } from "../buttons/LikeButton";
import { ViewButton } from "../buttons/ViewButton";

interface ListViewModeProps {
  ads: DatingAd[];
  onTagClick: (tag: string) => void;
  isLoading?: boolean;
  onAdAction: (adId: string, action: string) => void;
}

export const ListViewMode = ({
  ads,
  onTagClick,
  isLoading = false,
  onAdAction
}: ListViewModeProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-luxury-dark/50 backdrop-blur-sm rounded-xl border border-luxury-primary/10 overflow-hidden h-32 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-luxury-neutral/70">No ads match your criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ads.map((ad) => {
        const ageRange = getAgeRangeValues(ad.age_range);
        return (
          <div key={ad.id} className="bg-luxury-dark/50 backdrop-blur-sm rounded-xl border border-luxury-primary/10 overflow-hidden">
            <div className="flex p-4 gap-4">
              {/* Avatar section */}
              <div className="flex-shrink-0">
                <div className="relative h-20 w-20">
                  <img
                    src={ad.avatarUrl || ad.avatar_url}
                    alt={ad.title}
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
              </div>
              
              {/* Content section */}
              <div className="flex-grow">
                <div className="flex justify-between mb-1">
                  <h3 className="font-medium text-xl">{ad.title}</h3>
                  <div className="flex gap-1">
                    {ad.isVerified && <VerifiedBadge />}
                    {ad.isPremium && <PremiumBadge />}
                  </div>
                </div>
                
                <div className="flex text-xs text-luxury-neutral gap-2 mb-2">
                  <span>{ageRange.lower} - {ageRange.upper} years</span>
                  <span>•</span>
                  <span>{ad.location || `${ad.city}, ${ad.country}`}</span>
                  <span>•</span>
                  <DistanceBadge distance={10} />
                </div>
                
                <p className="text-sm text-luxury-neutral/80 line-clamp-1 mb-2">
                  {ad.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {ad.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-luxury-primary/10 hover:bg-luxury-primary/20 text-luxury-primary/90 rounded text-xs cursor-pointer transition-colors"
                      onClick={() => onTagClick(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                  {ad.tags && ad.tags.length > 3 && (
                    <span className="px-2 py-0.5 bg-luxury-primary/5 text-luxury-neutral/60 rounded text-xs">
                      +{ad.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Actions section */}
              <div className="flex flex-col justify-between items-end">
                <div className="text-xs text-luxury-neutral/60">
                  {ad.views} views
                </div>
                <div className="flex gap-2">
                  <ViewButton onClick={() => onAdAction(ad.id, 'view')} />
                  <LikeButton 
                    isLiked={false}
                    onClick={() => onAdAction(ad.id, 'like')}
                  />
                  <MessageButton onClick={() => onAdAction(ad.id, 'message')} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
