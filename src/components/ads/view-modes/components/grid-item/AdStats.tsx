
import { DatingAd } from '../../../types/dating';
import { MapPin, Heart, Eye, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdStatsProps {
  ad: DatingAd;
}

export const AdStats = ({ ad }: AdStatsProps) => {
  const formatAgeRange = () => {
    if (!ad.age_range) return 'N/A';
    return `${ad.age_range.lower}-${ad.age_range.upper}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center text-luxury-neutral">
          <MapPin className="h-3 w-3 mr-1 text-luxury-primary/80" />
          <span>{ad.city}, {ad.country}</span>
        </div>
        <div className="text-luxury-neutral">
          <span>{formatAgeRange()} y/o</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-luxury-neutral">
        <div className="flex space-x-3">
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>{ad.view_count || 0}</span>
          </div>
          <div className="flex items-center">
            <Heart className="h-3 w-3 mr-1" />
            <span>{ad.like_count || 0}</span>
          </div>
          <div className="flex items-center">
            <MessageCircle className="h-3 w-3 mr-1" />
            <span>{ad.message_count || 0}</span>
          </div>
        </div>
        
        {/* Profile completion progress */}
        <div className="flex items-center">
          <div className="w-16 h-1 rounded-full bg-luxury-neutral/20">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-300",
                ad.profile_completion_score && ad.profile_completion_score >= 80 
                  ? "bg-luxury-primary" 
                  : ad.profile_completion_score && ad.profile_completion_score >= 50 
                    ? "bg-yellow-500" 
                    : "bg-red-500"
              )}
              style={{ width: `${ad.profile_completion_score || 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
