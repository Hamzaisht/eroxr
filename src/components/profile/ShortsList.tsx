
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@supabase/auth-helpers-react";
import { Play, Trash2, Share, MessageCircle, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "@/components/feed/ShareDialog";
import { Post } from "@/integrations/supabase/types/post";
import { useQueryClient } from "@tanstack/react-query";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import { ErrorState } from "@/components/ui/ErrorState";

export const ShortsList = () => {
  const [shorts, setShorts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedShortId, setSelectedShortId] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const session = useSession();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { playLikeSound } = useSoundEffects();
  const isCurrentUser = session?.user?.id === id;

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        
        const { data, error } = await supabase
          .from('posts')
          .select(`
            id, 
            content, 
            video_urls,
            video_thumbnail_url,
            likes_count, 
            comments_count,
            view_count,
            created_at
          `)
          .eq('creator_id', id)
          .not('video_urls', 'is', null)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setShorts(data || []);
      } catch (error) {
        console.error('Error fetching shorts:', error);
        setIsError(true);
        toast({
          title: "Error loading shorts",
          description: "Failed to load user's shorts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchShorts();
    }
  }, [id, toast]);

  // Subscribe to real-time updates for the user's shorts
  useEffect(() => {
    if (!id) return;
    
    const channel = supabase
      .channel(`user-shorts-${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `creator_id=eq.${id}`
        },
        (payload) => {
          // Refresh the shorts list on any changes
          if (payload.eventType === 'INSERT') {
            // For new posts, add it to the list
            const newPost = payload.new as Post;
            // Only add if it has video URLs
            if (newPost.video_urls && newPost.video_urls.length > 0) {
              setShorts(prev => [newPost, ...prev]);
            }
          } else if (payload.eventType === 'DELETE') {
            // For deleted posts, remove it from the list
            const deletedId = payload.old.id;
            setShorts(prev => prev.filter(short => short.id !== deletedId));
          } else {
            // For updates, refresh the list through the API
            queryClient.invalidateQueries({ queryKey: ['posts'] });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient]);

  const handlePlayShort = (shortId: string) => {
    navigate(`/shorts?id=${shortId}`);
  };

  const handleDeleteShort = async (shortId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', shortId);
        
      if (error) throw error;
      
      setShorts(prev => prev.filter(short => short.id !== shortId));
      toast({
        title: "Short deleted",
        description: "Your short has been successfully deleted.",
      });
      
      // Invalidate queries to update the UI
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      console.error('Error deleting short:', error);
      toast({
        title: "Error deleting short",
        description: "Failed to delete your short. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleShareShort = (shortId: string) => {
    setSelectedShortId(shortId);
    setIsShareOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-[300px] w-full flex items-center justify-center p-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-luxury-darker rounded-full mb-4"></div>
          <div className="h-4 bg-luxury-darker rounded w-32 mb-2"></div>
          <div className="h-3 bg-luxury-darker/70 rounded w-40"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState 
        title="Couldn't load shorts" 
        description="We had trouble loading this user's shorts. Please try again later."
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="min-h-[300px] w-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-luxury-darker flex items-center justify-center mb-4">
          <Play className="w-8 h-8 text-luxury-neutral/50" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No shorts yet</h3>
        <p className="text-luxury-neutral mb-6 max-w-md">
          {isCurrentUser 
            ? "You haven't uploaded any short videos yet. Short videos are a great way to engage with your audience."
            : "This user hasn't uploaded any short videos yet."}
        </p>
        
        {isCurrentUser && (
          <Button 
            className="bg-luxury-primary hover:bg-luxury-primary/80"
            onClick={() => navigate("/shorts")}
          >
            Create Your First Short
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <AnimatePresence>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
          {shorts.map((short) => (
            <motion.div
              key={short.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative aspect-[9/16] overflow-hidden rounded-lg group bg-luxury-darker"
            >
              {/* Thumbnail */}
              <div 
                className="absolute inset-0 bg-cover bg-center cursor-pointer"
                style={{ 
                  backgroundImage: short.video_thumbnail_url 
                    ? `url(${short.video_thumbnail_url})` 
                    : `url(${short.video_urls?.[0]?.replace(/\.[^/.]+$/, ".jpg")})` 
                }}
                onClick={() => handlePlayShort(short.id)}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              </div>
              
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  className="w-12 h-12 rounded-full bg-luxury-primary/80 backdrop-blur-sm flex items-center justify-center hover:bg-luxury-primary transition-colors"
                  onClick={() => handlePlayShort(short.id)}
                >
                  <Play className="w-6 h-6 text-white ml-1" />
                </button>
              </div>
              
              {/* Stats overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                <div className="flex items-center space-x-2 text-white/90 text-xs">
                  <div className="flex items-center">
                    <Heart className="w-3 h-3 mr-1" />
                    <span>{short.likes_count || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    <span>{short.comments_count || 0}</span>
                  </div>
                  <div className="flex items-center ml-auto">
                    <span>{short.view_count || 0} views</span>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              {isCurrentUser && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-2">
                  <button
                    className="p-2 rounded-full bg-luxury-darker/80 backdrop-blur-sm hover:bg-red-500/80 transition-colors"
                    onClick={() => setConfirmDeleteId(short.id)}
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    className="p-2 rounded-full bg-luxury-darker/80 backdrop-blur-sm hover:bg-luxury-primary/80 transition-colors"
                    onClick={() => handleShareShort(short.id)}
                  >
                    <Share className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-2">Delete short</h3>
            <p className="text-luxury-neutral mb-6">
              Are you sure you want to delete this short? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => confirmDeleteId && handleDeleteShort(confirmDeleteId)}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Share dialog */}
      {selectedShortId && (
        <ShareDialog
          open={isShareOpen}
          onOpenChange={setIsShareOpen}
          postId={selectedShortId}
        />
      )}
    </div>
  );
};
