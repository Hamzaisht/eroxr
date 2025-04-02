
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TrendingCreator {
  id: string;
  username: string;
  avatar_url: string | null;
  earnings?: number;
  followers?: number;
}

export const useTrendingCreators = (limit = 5) => {
  const [creators, setCreators] = useState<TrendingCreator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setIsLoading(true);
        
        // Try to get top creators by earnings
        let { data, error } = await supabase
          .from('top_creators_by_earnings')
          .select('id, username, avatar_url')
          .limit(limit);
        
        // If there's an error with the view or missing column, fall back to profiles
        if (error) {
          console.log("Error fetching top creators by earnings, falling back to profiles:", error);
          
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .order('created_at', { ascending: false })
            .limit(limit);
            
          if (fallbackError) throw fallbackError;
          data = fallbackData;
        }
        
        setCreators(data || []);
      } catch (err) {
        console.error("Error fetching trending creators:", err);
        toast({
          title: "Error fetching creators",
          description: "Could not load trending creators",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreators();
  }, [limit, toast]);

  return { creators, isLoading };
};
