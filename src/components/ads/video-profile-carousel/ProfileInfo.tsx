
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { DatingAd } from '../types/dating';
import { getAgeRangeValues } from '@/utils/dating/ageRangeUtils';

interface ProfileInfoProps {
  ad: DatingAd;
  isPreviewMode?: boolean;
}

export const ProfileInfo = ({ ad, isPreviewMode = false }: ProfileInfoProps) => {
  const ageRange = getAgeRangeValues(ad.age_range);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black to-transparent">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white">{ad.title || ad.username}</h3>
          <p className="text-sm text-gray-300">{ad.location || `${ad.city || ''}, ${ad.country || ''}`}</p>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-white">
              Age {ad.age || `${ageRange.lower}-${ageRange.upper}`}
            </span>
            
            {ad.tags && ad.tags.length > 0 && (
              <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-white">
                #{ad.tags[0]}
              </span>
            )}
            
            {ad.tags && ad.tags.length > 1 && (
              <span className="text-xs text-gray-400">+{ad.tags.length - 1} more</span>
            )}
          </div>
        </div>
        
        {!isPreviewMode && (
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
