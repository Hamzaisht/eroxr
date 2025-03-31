import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Play, Heart, MessageSquare, Eye, MoreVertical, Trash, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./EmptyState";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  creator_id: string;
  content: string;
  media_url: string[];
  video_urls?: string[];
  video_thumbnail_url?: string;
  likes_count: number;
  comments_count: number;
  view_count?: number;
  created_at: string;
  updated_at: string;
  visibility: string;
  is_premium: boolean;
  post_type: string;
  has_saved?: boolean;
  price?: number;
  tags?: string[];
}

interface ShortsListProps {
  shorts?: Post[];
}

export const ShortsList = ({ shorts: propShorts }: ShortsListProps = {}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();
  const [shorts, setShorts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShort, setSelectedShort] = useState<Post | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const isOwner = session?.user?.id === id;

  useEffect(() => {
    if (propShorts && propShorts.length > 0) {
      setShorts(propShorts);
      setLoading(false);
      return;
    }
    
    const fetchShorts = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('creator_id', id)
          .eq('post_type', 'short')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        const formattedShorts = data?.map(short => ({
          id: short.id,
          creator_id: short.creator_id,
          content: short.content,
          media_url: short.media_url,
          video_urls: short.video_urls,
          video_thumbnail_url: short.video_thumbnail_url,
          likes_count: short.likes_count,
          comments_count: short.comments_count,
          view_count: short.view_count,
          created_at: short.created_at,
          updated_at: short.updated_at,
          visibility: short.visibility,
          is_premium: short.is_premium,
          post_type: short.post_type,
          has_saved: short.has_saved || false,
          price: short.price,
          tags: short.tags
        })) as Post[];
        
        setShorts(formattedShorts || []);
      } catch (error) {
        console.error('Error fetching shorts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShorts();
    }
  }, [id, propShorts]);

  const handleDelete = async (shortId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', shortId);
        
      if (error) throw error;
      
      setShorts(shorts.filter(short => short.id !== shortId));
      toast({
        title: "Short deleted",
        description: "Your short has been successfully deleted",
      });
    } catch (error) {
      console.error('Error deleting short:', error);
      toast({
        title: "Error",
        description: "Failed to delete short",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array(8).fill(0).map((_, i) => (
          <Skeleton key={i} className="aspect-[9/16] rounded-xl" />
        ))}
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <EmptyState
        title="No Shorts Yet"
        description={isOwner ? "Upload your first short to get started!" : "This user hasn't uploaded any shorts yet."}
        icon={Video}
        actionLabel={isOwner ? "Upload Short" : undefined}
        onAction={isOwner ? () => navigate("/shorts/upload") : undefined}
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {shorts.map((short) => (
          <motion.div
            key={short.id}
            className="group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setSelectedShort(short);
              setIsPreviewOpen(true);
            }}
          >
            <img 
              src={short.video_thumbnail_url || short.video_urls?.[0] || "/placeholder.svg"} 
              alt={short.content}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Play className="w-12 h-12 text-white" fill="white" />
              </div>
              
              <div className="absolute bottom-2 left-2 right-2 flex justify-between text-white text-sm">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>{short.likes_count}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>{short.comments_count}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>{short.view_count || 0}</span>
                </div>
              </div>
            </div>
            
            {isOwner && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/50 rounded-full">
                      <MoreVertical className="h-4 w-4 text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(short.id);
                    }}>
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-black">
          {selectedShort && (
            <div className="relative w-full aspect-[9/16]">
              <video
                src={selectedShort.video_urls?.[0] || selectedShort.media_url[0]}
                poster={selectedShort.video_thumbnail_url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
