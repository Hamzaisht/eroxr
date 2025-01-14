import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useShortActions = () => {
  const { toast } = useToast();
  const session = useSession();

  const handleLike = async (shortId: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like shorts",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: existingLike } = await supabase
        .from("post_likes")
        .select()
        .eq("post_id", shortId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (existingLike) {
        await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", shortId)
          .eq("user_id", session.user.id);

        toast({
          title: "Like removed",
          description: "Your like has been removed",
        });
      } else {
        await supabase
          .from("post_likes")
          .insert([{ post_id: shortId, user_id: session.user.id }]);

        toast({
          title: "Short liked",
          description: "Added to your liked shorts",
        });
      }
    } catch (error) {
      console.error("Like error:", error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (shortId: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save shorts",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: existingSave } = await supabase
        .from("post_saves")
        .select()
        .eq("post_id", shortId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (existingSave) {
        await supabase
          .from("post_saves")
          .delete()
          .eq("post_id", shortId)
          .eq("user_id", session.user.id);

        toast({
          title: "Removed from saved",
          description: "Short has been removed from your saved items",
        });
      } else {
        await supabase
          .from("post_saves")
          .insert([{ post_id: shortId, user_id: session.user.id }]);

        toast({
          title: "Short saved",
          description: "Added to your saved shorts",
        });
      }
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to update save status",
        variant: "destructive",
      });
    }
  };

  return { handleLike, handleSave };
};