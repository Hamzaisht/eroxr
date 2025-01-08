import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePostDeletion = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (postId: string, creatorId: string) => {
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (error) {
        console.error("Delete post error:", error);
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      
      toast({
        title: "Success",
        description: "Your post has been successfully deleted.",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { handleDelete };
};