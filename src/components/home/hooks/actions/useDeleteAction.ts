
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useDeleteAction = () => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (shortId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Sign in required",
        description: "Please sign in to delete this video",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Get the post to check creator_id and video URL
      const { data: post, error: postError } = await supabase
        .from("posts")
        .select("creator_id, video_urls")
        .eq("id", shortId)
        .single();

      if (postError) throw postError;

      // Check if user is the creator
      if (post.creator_id !== session.user.id) {
        toast({
          title: "Permission denied",
          description: "You can only delete your own videos",
          variant: "destructive",
        });
        return false;
      }

      // Delete the post
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", shortId);

      if (deleteError) throw deleteError;

      // Try to delete the video file from storage (best effort)
      if (post.video_urls && post.video_urls.length > 0) {
        try {
          // Extract the path from URL
          const videoUrl = post.video_urls[0];
          const urlParts = videoUrl.split('/');
          const bucketName = 'shorts';
          
          // The path should be everything after the bucket name in the URL
          const pathIndex = urlParts.findIndex(part => part === bucketName) + 1;
          if (pathIndex > 0 && pathIndex < urlParts.length) {
            const path = urlParts.slice(pathIndex).join('/');
            
            await supabase.storage
              .from(bucketName)
              .remove([path]);
          }
        } catch (storageError) {
          console.error("Failed to remove video file from storage:", storageError);
          // We continue even if file deletion fails
        }
      }

      // Invalidate query to refresh data
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast({
        title: "Video deleted",
        description: "Your video has been deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting video:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the video",
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleDelete };
};
