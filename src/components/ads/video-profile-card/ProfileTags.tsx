
import { Badge } from '@/components/ui/badge';
import { DatingAd } from '../types/dating';

interface ProfileTagsProps {
  ad: DatingAd;
  maxTags?: number;
}

export const ProfileTags = ({ ad, maxTags }: ProfileTagsProps) => {
  // Decide how many tags to show, if maxTags is specified
  const tagsToShow = maxTags ? 
    (ad.tags?.slice(0, maxTags) || []) : 
    (ad.tags || []);
  
  // Decide how many "looking for" tags to show
  const lookingForToShow = maxTags && Array.isArray(ad.looking_for) ? 
    ad.looking_for.slice(0, Math.min(2, maxTags)) : 
    ad.looking_for;

  // Handle tag click for filtering if onTagClick is available
  const handleTagClick = (tag: string, event: React.MouseEvent) => {
    if (ad.onTagClick) {
      event.stopPropagation(); // Prevent opening the ad modal
      ad.onTagClick(tag);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tagsToShow.map(tag => (
        <Badge 
          key={tag} 
          variant="outline" 
          className={`bg-luxury-dark/50 text-luxury-neutral border-none ${ad.onTagClick ? 'cursor-pointer hover:bg-luxury-dark' : ''}`}
          onClick={ad.onTagClick ? (e) => handleTagClick(tag, e) : undefined}
        >
          {tag}
        </Badge>
      ))}
      
      {Array.isArray(lookingForToShow) && lookingForToShow.map(seekingType => (
        <Badge key={seekingType} className="bg-luxury-primary/80 text-white">
          Seeking {seekingType}
        </Badge>
      ))}
      
      {/* Show "+" badge if there are more tags */}
      {maxTags && ad.tags && ad.tags.length > maxTags && (
        <Badge variant="outline" className="bg-luxury-dark/50 text-luxury-neutral border-none">
          +{ad.tags.length - maxTags} more
        </Badge>
      )}
    </div>
  );
};
