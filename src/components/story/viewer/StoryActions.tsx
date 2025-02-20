
import { useState, useEffect } from "react";
import { Heart, Eye, MessageCircle, Share2, MoreVertical, Edit, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSession } from "@supabase/auth-helpers-react";
import { Story } from "@/integrations/supabase/types/story";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StoryActionsProps {
  story: Story;
  onDelete?: () => void;
  onEdit?: () => void;
}

interface StoryViewer {
  id: string;
  username: string;
  avatar_url: string;
  action_type: string;
  created_at: string;
}

interface PostMediaAction {
  id: string;
  action_type: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

export const StoryActions = ({ 
  story,
  onDelete,
  onEdit 
}: StoryActionsProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [showViewers, setShowViewers] = useState(false);
  const [viewers, setViewers] = useState<StoryViewer[]>([]);
  const [stats, setStats] = useState({
    views: 0,
    screenshots: 0,
    shares: 0,
    comments: 0
  });

  const isOwner = session?.user?.id === story.creator_id;

  // Real-time updates subscription
  useEffect(() => {
    const channel = supabase
      .channel('story-interactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_media_actions',
          filter: `post_id=eq.${story.id}`
        },
        (payload) => {
          fetchStoryStats();
          fetchViewers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [story.id]);

  const fetchStoryStats = async () => {
    try {
      const { data: viewsData } = await supabase
        .from('post_media_actions')
        .select('action_type')
        .eq('post_id', story.id);

      if (viewsData) {
        setStats({
          views: viewsData.filter(d => d.action_type === 'view').length,
          screenshots: viewsData.filter(d => d.action_type === 'screenshot').length,
          shares: viewsData.filter(d => d.action_type === 'share').length,
          comments: viewsData.filter(d => d.action_type === 'comment').length
        });
      }
    } catch (error) {
      console.error('Error fetching story stats:', error);
    }
  };

  const fetchViewers = async () => {
    try {
      const { data } = await supabase
        .from('post_media_actions')
        .select(`
          id,
          action_type,
          created_at,
          user_id,
          profiles!inner (
            username,
            avatar_url
          )
        `)
        .eq('post_id', story.id)
        .order('created_at', { ascending: false });

      if (data) {
        const viewersData = (data as PostMediaAction[]).map(d => ({
          id: d.id,
          username: d.profiles.username || 'Unknown',
          avatar_url: d.profiles.avatar_url || '',
          action_type: d.action_type,
          created_at: d.created_at
        }));
        setViewers(viewersData);
      }
    } catch (error) {
      console.error('Error fetching viewers:', error);
    }
  };

  const handleShare = async () => {
    try {
      await supabase
        .from('post_media_actions')
        .insert({
          post_id: story.id,
          user_id: session?.user?.id,
          action_type: 'share'
        });

      toast({
        title: "Story shared",
        description: "Story has been shared successfully",
      });
    } catch (error) {
      console.error('Error sharing story:', error);
      toast({
        title: "Error",
        description: "Failed to share story",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStoryStats();
    fetchViewers();
  }, [story.id]);

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
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <span className="text-white text-xs">{stats.comments}</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg text-white hover:bg-white/20"
          onClick={handleShare}
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

      <Dialog open={showViewers} onOpenChange={setShowViewers}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-gray-900 to-black text-white">
          <DialogHeader>
            <DialogTitle>Story Viewers</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {viewers.map((viewer) => (
              <div key={viewer.id} className="flex items-center gap-3 py-2">
                <Avatar>
                  <AvatarImage src={viewer.avatar_url} />
                  <AvatarFallback>{viewer.username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{viewer.username}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(viewer.created_at).toLocaleTimeString()}
                    {viewer.action_type !== 'view' && ` • ${viewer.action_type}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
