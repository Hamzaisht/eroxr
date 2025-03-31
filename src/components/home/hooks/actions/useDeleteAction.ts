
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export const useDeleteAction = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const { toast } = useToast();

  const handleDelete = useCallback(async (shortId: string) => {
    if (!session?.user?.id) {
      throw new Error("Authentication required");
    }

    try {
      // Get the post to check if user owns it and to get video URL
      const { data: post, error: fetchError } = await supabase
        .from("posts")
        .select("creator_id, video_urls")
        .eq("id", shortId)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // Verify ownership
      if (post.creator_id !== session.user.id) {
        throw new Error("You don't have permission to delete this post");
      }

      // Delete the post
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", shortId);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // Attempt to delete the video from storage
      if (post.video_urls && post.video_urls.length > 0) {
        // Extract filename from URL
        const videoUrl = post.video_urls[0];
        const urlParts = videoUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${session.user.id}/${fileName}`;

        // Delete file from storage
        const { error: storageError } = await supabase
          .storage
          .from('shorts')
          .remove([filePath]);

        if (storageError) {
          console.error("Error removing video file:", storageError);
          // We continue even if storage deletion fails
        }
      }

      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      return true;
    } catch (error: any) {
      console.error("Delete short error:", error.message);
      throw error;
    }
  }, [session, queryClient]);

  return { handleDelete };
};
