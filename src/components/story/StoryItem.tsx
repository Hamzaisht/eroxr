import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { StoryViewer } from "./StoryViewer";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface StoryItemProps {
  stories: Array<{
    id: string;
    media_url: string;
    created_at: string;
    expires_at: string;
  }>;
  creator: {
    id: string;
    username: string;
    avatar_url: string;
  };
  index: number;
}

export const StoryItem = ({ stories, creator, index }: StoryItemProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const latestStory = stories[0];
  const timeAgo = formatDistanceToNow(new Date(latestStory.created_at), { addSuffix: true });
  const { toast } = useToast();
  const session = useSession();

  const handleEdit = async (storyId: string) => {
    // For now just show a toast - edit functionality can be added later
    toast({
      title: "Coming soon",
      description: "Story editing will be available soon!",
    });
  };

  const handleDelete = async (storyId: string) => {
    try {
      const { error } = await supabase
        .from("stories")
        .delete()
        .eq("id", storyId);

      if (error) throw error;

      toast({
        title: "Story deleted",
        description: "Your story has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete story. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="flex-shrink-0"
      >
        <div className="w-28 rounded-xl border border-luxury-neutral/10 bg-gradient-to-br from-luxury-dark/50 to-luxury-primary/5 p-2 cursor-pointer hover:bg-luxury-neutral/5 transition-all duration-300 group">
          <div className="relative mb-2">
            <Link 
              to={`/profile/${creator.id}`} 
              className="absolute -top-2 -left-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-0.5 rounded-full bg-gradient-to-br from-luxury-primary to-luxury-secondary">
                <Avatar className="h-8 w-8 ring-2 ring-luxury-dark">
                  <AvatarImage src={creator.avatar_url} />
                  <AvatarFallback>
                    {creator.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Link>

            {/* Three dots menu */}
            {creator.id === session?.user?.id && (
              <div className="absolute -top-2 -right-2 z-10" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
                      <MoreVertical className="h-4 w-4 text-white" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => handleEdit(latestStory.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Story
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(latestStory.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Story
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <div onClick={() => setIsViewerOpen(true)}>
              <img 
                src={latestStory.media_url} 
                alt={`Story by ${creator.username}`}
                className="aspect-[3/4] rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-1 left-1 right-1">
                <p className="text-[10px] text-white/70 truncate bg-black/30 rounded px-1">
                  {timeAgo}
                </p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-luxury-neutral truncate group-hover:text-luxury-primary transition-colors">
              {creator.username}
            </p>
          </div>
        </div>
      </motion.div>

      <StoryViewer
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        stories={stories}
        creator={creator}
      />
    </>
  );
};