
import { useState } from "react";
import { Eye, Share2, MoreVertical, Edit, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useSession } from "@supabase/auth-helpers-react";
import { Story } from "@/integrations/supabase/types/story";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ViewersList } from "./components/ViewersList";
import { ShareDialog } from "./components/ShareDialog";
import { useEffect } from "react";
import { useStoryStats } from "./hooks/useStoryStats";
import { useStoryViewers } from "./hooks/useStoryViewers";

interface StoryActionsProps {
  story: Story;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const StoryActions = ({ 
  story,
  onDelete,
  onEdit 
}: StoryActionsProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [showViewers, setShowViewers] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const stats = useStoryStats(story.id);
  const viewers = useStoryViewers(story.id);

  const isOwner = session?.user?.id === story.creator_id;

  // Register view when story is opened
  useEffect(() => {
    const registerView = async () => {
      if (session?.user?.id) {
        try {
          await supabase
            .from('post_media_actions')
            .insert({
              post_id: story.id,
              user_id: session.user.id,
              action_type: 'view'
            });
        } catch (error) {
          console.error('Error registering view:', error);
        }
      }
    };

    registerView();
  }, [story.id, session?.user?.id]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg text-white hover:bg-white/20"
          onClick={() => setShowViewers(true)}
        >
          <Eye className="w-6 h-6" />
        </Button>
        <span className="text-white text-xs">{stats.views}</span>
      </div>

      {isOwner && (
        <div className="flex flex-col items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg text-white hover:bg-white/20"
            onClick={() => setShowViewers(true)}
          >
            <Download className="w-6 h-6" />
          </Button>
          <span className="text-white text-xs">{stats.screenshots}</span>
        </div>
      )}

      <div className="flex flex-col items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg text-white hover:bg-white/20"
          onClick={() => setShowShareDialog(true)}
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

      <ViewersList 
        open={showViewers} 
        onOpenChange={setShowViewers}
        viewers={viewers}
      />

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        storyId={story.id}
      />
    </div>
  );
};
