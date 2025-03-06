
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DatingAd } from "./types/dating";

export const useAdsQuery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('public:dating_ads')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dating_ads'
        },
        (payload) => {
          console.log("Received dating ad update:", payload);
          queryClient.invalidateQueries({ queryKey: ["dating_ads"] });

          if (payload.eventType === 'INSERT') {
            toast({
              title: "New dating ad",
              description: "Someone just posted a new dating ad!",
              duration: 3000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  return useQuery({
    queryKey: ["dating_ads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dating_ads")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DatingAd[];
    },
    staleTime: 0,
  });
};

// Export the useQuery hook as well for direct access
useAdsQuery.useQuery = useQuery;
