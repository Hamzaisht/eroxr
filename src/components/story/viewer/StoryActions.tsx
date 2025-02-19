
import { Heart, Eye, MessageCircle, Share2, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ViewerStats {
  views: number;
  screenshots: number;
  shares: number;
  likes: number;
}

interface StoryActionsProps {
  stats: ViewerStats;
  isOwner: boolean;
  onViewersClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const StoryActions = ({ 
  stats, 
  isOwner,
  onViewersClick,
  onEdit,
  onDelete 
}: StoryActionsProps) => {
  return (
    <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-30">
      <div className="flex flex-col items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg text-white hover:bg-white/20"
        >
          <Heart className="w-6 h-6" />
        </Button>
        <span className="text-white text-xs">{stats.likes}</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg text-white hover:bg-white/20"
          onClick={onViewersClick}
        >
          <Eye className="w-6 h-6" />
        </Button>
        <span className="text-white text-xs">{stats.views}</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg text-white hover:bg-white/20"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <span className="text-white text-xs">{stats.screenshots}</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg text-white hover:bg-white/20"
        >
          <Share2 className="w-6 h-6" />
        </Button>
        <span className="text-white text-xs">{stats.shares}</span>
      </div>

      {isOwner && (
        <div className="flex flex-col items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg text-white hover:bg-white/20"
              >
                <MoreVertical className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Story
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Story
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};
