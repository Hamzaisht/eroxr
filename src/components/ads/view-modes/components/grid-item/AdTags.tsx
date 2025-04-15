
import { Badge } from "@/components/ui/badge";
import type { DatingAd } from "../../../types/dating";

interface AdTagsProps {
  ad: DatingAd;
  onTagClick?: (tag: string, e: React.MouseEvent) => void;
}

export const AdTags = ({ ad, onTagClick }: AdTagsProps) => {
  if (!ad.tags || ad.tags.length === 0) return null;

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onTagClick?.(tag, e);
  };

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {ad.tags.slice(0, 3).map((tag) => (
        <Badge 
          key={tag} 
          variant="outline" 
          className="bg-luxury-darker/50 text-[10px] cursor-pointer hover:bg-luxury-primary/20"
          onClick={(e) => handleTagClick(tag, e)}
        >
          {tag}
        </Badge>
      ))}
      {ad.tags.length > 3 && (
        <Badge 
          variant="outline" 
          className="bg-luxury-darker/50 text-[10px]"
        >
          +{ad.tags.length - 3}
        </Badge>
      )}
    </div>
  );
};
