
import { Heart, Eye, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DatingAd } from "../../../types/dating";

interface AdStatsProps {
  ad: DatingAd;
  size?: 'sm' | 'md' | 'lg';
  showStatLabels?: boolean;
  className?: string;
}

export const AdStats = ({ 
  ad, 
  size = 'md', 
  showStatLabels = false,
  className 
}: AdStatsProps) => {
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };
  
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };
  
  // Use view_count or views_count property
  const viewCount = ad.view_count || ad.views_count || 0;
  const likeCount = ad.click_count || 0;
  const messageCount = ad.message_count || 0;
  
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-center gap-1">
        <Eye className={cn(iconSizes[size], "text-luxury-neutral")} />
        <span className={cn(textSizes[size], "text-luxury-neutral")}>
          {viewCount}
          {showStatLabels && <span className="ml-1">Views</span>}
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        <Heart className={cn(iconSizes[size], "text-luxury-neutral")} />
        <span className={cn(textSizes[size], "text-luxury-neutral")}>
          {likeCount}
          {showStatLabels && <span className="ml-1">Likes</span>}
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        <MessageCircle className={cn(iconSizes[size], "text-luxury-neutral")} />
        <span className={cn(textSizes[size], "text-luxury-neutral")}>
          {messageCount}
          {showStatLabels && <span className="ml-1">Messages</span>}
        </span>
      </div>
    </div>
  );
};
