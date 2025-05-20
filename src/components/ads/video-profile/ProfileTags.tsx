
import { XCircle } from "lucide-react";
import { DatingAd } from "@/types/dating";
import { getAgeRangeValues } from "@/utils/dating/ageRangeUtils";

interface ProfileTagsProps {
  ad: DatingAd;
  onTagClick?: (tag: string) => void;
}

export const ProfileTags = ({ ad, onTagClick }: ProfileTagsProps) => {
  // Handle missing ad
  if (!ad) return null;
  
  const ageRange = getAgeRangeValues(ad.age_range);
  
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {/* Age range tag */}
      <span className="px-3 py-1 rounded-full bg-luxury-primary/10 text-luxury-primary/90 text-xs inline-flex items-center">
        <span>{ageRange.lower}-{ageRange.upper} years</span>
      </span>
      
      {/* Location tag */}
      <span className="px-3 py-1 rounded-full bg-luxury-primary/10 text-luxury-primary/90 text-xs inline-flex items-center">
        <span>{ad.location || `${ad.city || ''}, ${ad.country || ''}`}</span>
      </span>
      
      {/* Dynamically show some tags from ad */}
      {ad.tags?.slice(0, 3).map(tag => (
        <span 
          key={tag} 
          className="px-3 py-1 rounded-full bg-luxury-primary/10 text-luxury-primary/90 text-xs inline-flex items-center cursor-pointer hover:bg-luxury-primary/20 transition-colors"
          onClick={() => onTagClick && onTagClick(tag)}
        >
          <span>#{tag}</span>
        </span>
      ))}
      
      {/* Show more tags indicator if there are more than shown */}
      {ad.tags && ad.tags.length > 3 && (
        <span className="px-3 py-1 rounded-full bg-luxury-primary/5 text-luxury-neutral/60 text-xs inline-flex items-center">
          <span>+{ad.tags.length - 3} more</span>
        </span>
      )}
    </div>
  );
};
