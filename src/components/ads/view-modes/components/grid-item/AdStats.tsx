
import { DatingAd } from '../../../types/dating';
import { Eye, MessageCircle, Click } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdStatsProps {
  ad: DatingAd;
}

export const AdStats = ({ ad }: AdStatsProps) => {
  // Format numbers for display
  const formatNumber = (num?: number): string => {
    if (num === undefined || num === null) return '0';
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 10000) {
      return (num / 1000).toFixed(0) + 'K';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    
    return num.toString();
  };
  
  // Default value as fallback for older data
  const viewCount = ad.view_count || 0;
  const messageCount = ad.message_count || 0;
  const clickCount = ad.click_count || 0;
  
  return (
    <div className="flex items-center space-x-3 text-xs text-luxury-neutral/70">
      <div className="flex items-center gap-1">
        <Eye className="w-3 h-3 text-luxury-primary/70" />
        <span>
          {formatNumber(viewCount)}
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        <MessageCircle className="w-3 h-3 text-luxury-primary/70" />
        <span>
          {formatNumber(messageCount)}
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        <Click className="w-3 h-3 text-luxury-primary/70" />
        <span>
          {formatNumber(clickCount)}
        </span>
      </div>
    </div>
  );
};
