
import { Badge } from '@/components/ui/badge';
import { DatingAd } from '../types/dating';

interface ProfileTagsProps {
  ad: DatingAd;
}

export const ProfileTags = ({ ad }: ProfileTagsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {ad.tags && ad.tags.map(tag => (
        <Badge key={tag} variant="outline" className="bg-luxury-dark/50 text-luxury-neutral border-none">
          {tag}
        </Badge>
      ))}
      
      {Array.isArray(ad.looking_for) && ad.looking_for.map(seekingType => (
        <Badge key={seekingType} className="bg-luxury-primary/80 text-white">
          Seeking {seekingType}
        </Badge>
      ))}
    </div>
  );
};
