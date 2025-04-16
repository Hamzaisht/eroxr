import { useState } from "react";
import { Post } from "@/integrations/supabase/types/post";
import { motion } from "framer-motion";
import { Play, Eye, Heart, MessageCircle, Clock, MoreVertical, Trash } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useShortActions } from "@/components/home/hooks/actions";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getPlayableMediaUrl } from "@/utils/media/getPlayableMediaUrl";
import { getDirectMediaUrl } from "@/utils/media/mediaUrlUtils";

export const ShortsList = ({ shorts }: { shorts: Post[] }) => {
  const [selectedVideo, setSelectedVideo] = useState<Post | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const session = useSession();
  const navigate = useNavigate();
  const { handleDelete, handleView } = useShortActions();
  const { toast } = useToast();
  
  const viewShort = (short: Post) => {
    navigate(`/shorts?id=${short.id}`);
  };
  
  const handleVideoPreview = (short: Post) => {
    setSelectedVideo(short);
    // Track view when previewing
    if (short.id) {
      handleView(short.id);
    }
  };
  
  const confirmDelete = (id: string) => {
    setDeletingVideoId(id);
    setIsDeleteAlertOpen(true);
  };
  
  const handleDeleteVideo = async () => {
    if (!deletingVideoId) return;
    
    try {
      await handleDelete(deletingVideoId);
      setIsDeleteAlertOpen(false);
      setSelectedVideo(null);
      toast({
        title: "Success",
        description: "Video deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Error",
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingVideoId(null);
    }
  };

  const formatVideoDuration = (post: Post) => {
    if (post.video_duration) {
      const minutes = Math.floor(post.video_duration / 60);
      const seconds = Math.floor(post.video_duration % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    }
    
    return "00:30";
  };
  
  const handleVideoError = () => {
    console.error("Video failed to load in ShortsList");
    toast({
      title: "Video Error",
      description: "Unable to play this video. Please try again later.",
      variant: "destructive",
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {shorts.map((short) => (
          <motion.div
            key={short.id}
            className="relative rounded-lg overflow-hidden bg-luxury-darker/50 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="aspect-[9/16] relative cursor-pointer" onClick={() => handleVideoPreview(short)}>
              <div className="absolute inset-0 bg-black">
                {short.video_thumbnail_url ? (
                  <img 
                    src={short.video_thumbnail_url} 
                    alt={short.content || "Video thumbnail"} 
                    className="w-full h-full object-cover"
                  />
                ) : short.video_urls && short.video_urls[0] ? (
                  <div className="flex items-center justify-center h-full bg-luxury-darker/50">
                    <Play className="h-12 w-12 text-white/50" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Play className="h-12 w-12 text-white/50" />
                  </div>
                )}
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-luxury-primary/30 backdrop-blur-md flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" fill="white" />
                </div>
              </div>
              
              <div className={cn(
                "absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent",
                "opacity-100 group-hover:opacity-0 transition-opacity duration-300"
              )}>
                <div className="flex items-center text-xs text-white/80 gap-2">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{short.view_count || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-3 w-3 mr-1" />
                    <span>{short.likes_count || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    <span>{short.comments_count || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-xs text-white/90 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatVideoDuration(short)}</span>
              </div>
            </div>
            
            <div className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium line-clamp-1">
                    {short.content || "No title"}
                  </h3>
                  <p className="text-xs text-luxury-neutral/70 mt-1">
                    {formatDistanceToNow(new Date(short.created_at), { addSuffix: true })}
                  </p>
                </div>
                
                {session?.user?.id === short.creator_id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-full hover:bg-luxury-primary/20 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-luxury-darker border-luxury-primary/20">
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => viewShort(short)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                        onClick={() => confirmDelete(short.id)}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-md md:max-w-xl bg-black border-luxury-primary/20 p-0 gap-0 overflow-hidden">
          {selectedVideo && (
            <div className="relative w-full aspect-[9/16]">
              <VideoPlayer 
                url={getDirectMediaUrl(selectedVideo.video_urls?.[0] || "")} 
                poster={selectedVideo.video_thumbnail_url || undefined}
                autoPlay
                showCloseButton
                onClose={() => setSelectedVideo(null)}
                onError={handleVideoError}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="bg-black border-luxury-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this video? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVideo} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
