
import { Badge } from "@/components/ui/badge";
import type { DatingAd } from "../types/dating";

interface ProfileTagsProps {
  ad: DatingAd;
}

export const ProfileTags = ({ ad }: ProfileTagsProps) => {
  const renderTags = () => {
    const tags = [];
    
    if (ad.age_range) {
      tags.push(`${ad.age_range.lower}-${ad.age_range.upper} y/o`);
    }
    
    if (ad.body_type) {
      tags.push(ad.body_type);
    }
    
    if (ad.is_verified) {
      tags.push('Verified');
    }
    
    if (ad.education_level) {
      tags.push(ad.education_level);
    }

    return tags;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {renderTags().map((tag, index) => (
        <Badge 
          key={index}
          variant="secondary" 
          className="bg-luxury-primary/10 text-luxury-primary border-luxury-primary/20"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};
