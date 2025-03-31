
import { supabase } from "@/integrations/supabase/client";

export const useViewAction = () => {
  // Add view tracking function
  const handleView = async (shortId: string) => {
    try {
      // Update view count in the database
      const { error: updateError } = await supabase
        .from("posts")
        .update({ view_count: supabase.rpc('increment', { count: 1 }) })
        .eq("id", shortId);

      if (updateError) throw updateError;
      
      return true;
    } catch (error) {
      console.error("Error tracking view:", error);
      return false;
    }
  };

  return { handleView };
};
