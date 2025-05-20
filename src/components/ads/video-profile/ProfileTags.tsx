
import { Badge } from "@/components/ui/badge";
import { DatingAd } from "@/types/dating";
import { getLowerAgeValue, getUpperAgeValue } from "@/utils/dating/ageRangeHelper";

interface ProfileTagsProps {
  ad: DatingAd;
  onTagClick?: (tag: string) => void;
}

export const ProfileTags = ({ ad, onTagClick }: ProfileTagsProps) => {
  // Helper to handle tag clicks
  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {/* Age Range Badge */}
      {ad.age_range && (
        <Badge 
          variant="secondary"
          className="text-xs bg-black/40 hover:bg-black/60"
          onClick={() => handleTagClick(`age-${getLowerAgeValue(ad.age_range)}-${getUpperAgeValue(ad.age_range)}`)}
        >
          {getLowerAgeValue(ad.age_range)}-{getUpperAgeValue(ad.age_range)}
        </Badge>
      )}
      
      {/* Relationship Status */}
      {ad.relationship_status && (
        <Badge 
          variant="secondary"
          className="text-xs bg-black/40 hover:bg-black/60"
          onClick={() => handleTagClick(ad.relationship_status || '')}
        >
          {ad.relationship_status}
        </Badge>
      )}
      
      {/* Tags */}
      {ad.tags?.slice(0, 3).map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="text-xs bg-black/40 hover:bg-black/60"
          onClick={() => handleTagClick(tag)}
        >
          {tag}
        </Badge>
      ))}
      
      {/* Show more badge if there are more tags */}
      {ad.tags && ad.tags.length > 3 && (
        <Badge 
          variant="secondary" 
          className="text-xs bg-black/40 hover:bg-black/60"
        >
          +{ad.tags.length - 3}
        </Badge>
      )}
    </div>
  );
};
