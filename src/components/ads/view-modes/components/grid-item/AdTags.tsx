
import { Badge } from '@/components/ui/badge';
import { DatingAd } from '../../../types/dating';

interface AdTagsProps {
  ad: DatingAd;
}

export const AdTags = ({ ad }: AdTagsProps) => {
  if (!ad.tags || ad.tags.length === 0) return null;
  
  // Handle tag click if the ad has an onTagClick handler
  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (ad.onTagClick) {
      ad.onTagClick(tag);
    }
  };
  
  return (
    <div className="flex flex-wrap gap-1.5">
      {ad.tags.slice(0, 3).map((tag) => (
        <Badge 
          key={tag}
          variant="outline" 
          className="text-[10px] py-0 px-1.5 bg-luxury-darker/70 border-luxury-primary/15 text-luxury-neutral cursor-pointer hover:bg-luxury-primary/10 hover:border-luxury-primary/30 transition-colors"
          onClick={(e) => handleTagClick(tag, e)}
        >
          {tag}
        </Badge>
      ))}
      {ad.tags.length > 3 && (
        <Badge 
          variant="outline" 
          className="text-[10px] py-0 px-1.5 bg-luxury-darker/70 border-luxury-primary/15 text-luxury-neutral"
        >
          +{ad.tags.length - 3}
        </Badge>
      )}
    </div>
  );
};
