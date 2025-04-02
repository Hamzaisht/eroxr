
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContentInteractions } from "./types";

export function useInteractionData() {
  const { toast } = useToast();

  const fetchContentInteractions = async (contentId: string, contentType: string): Promise<ContentInteractions | null> => {
    try {
      let interactionsData = {
        viewers: [],
        likers: [],
        buyers: []
      };
      
      // Fetch viewers
      if (contentType === 'post') {
        const { data: viewData } = await supabase
          .from('post_media_actions')
          .select(`
            user_id,
            created_at,
            profiles(username, avatar_url)
          `)
          .eq('post_id', contentId)
          .eq('action_type', 'view');
          
        if (viewData) interactionsData.viewers = viewData;
      }
      
      // Fetch likers
      if (contentType === 'post') {
        const { data: likeData } = await supabase
          .from('post_likes')
          .select(`
            user_id,
            created_at,
            profiles(username, avatar_url)
          `)
          .eq('post_id', contentId);
          
        if (likeData) interactionsData.likers = likeData;
      }
      
      // Fetch buyers
      if (contentType === 'post') {
        const { data: purchaseData } = await supabase
          .from('post_purchases')
          .select(`
            user_id,
            amount,
            created_at,
            profiles(username, avatar_url)
          `)
          .eq('post_id', contentId);
          
        if (purchaseData) interactionsData.buyers = purchaseData;
      }
      
      return interactionsData;
    } catch (error) {
      console.error("Error fetching content interactions:", error);
      toast({
        title: "Error",
        description: "Could not load content interaction data",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    fetchContentInteractions
  };
}
