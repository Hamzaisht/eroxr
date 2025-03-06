
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ModerationStatus } from "../types";

export const useAdModerationStatus = () => {
  const session = useSession();
  const { toast } = useToast();
  
  // Track notifications for moderation status changes
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const channel = supabase
      .channel(`dating_ads_moderation_${session.user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'dating_ads',
          filter: `user_id=eq.${session.user.id}`
        },
        (payload) => {
          const newStatus = payload.new.moderation_status;
          const oldStatus = payload.old.moderation_status;
          
          if (oldStatus === 'pending' && newStatus === 'approved') {
            toast({
              title: "Ad Approved!",
              description: "Your body contact ad has been approved and is now visible",
              duration: 5000,
            });
          } else if (newStatus === 'rejected') {
            toast({
              title: "Ad Rejected",
              description: "Your body contact ad was rejected. Please review our guidelines",
              variant: "destructive",
              duration: 5000,
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, toast]);
  
  // Query to get moderation statuses for user's ads
  return useQuery({
    queryKey: ["dating_ads_moderation", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("dating_ads")
        .select("id, moderation_status, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      return data.map(ad => ({
        id: ad.id,
        status: ad.moderation_status as ModerationStatus,
        createdAt: ad.created_at
      }));
    },
    enabled: !!session?.user?.id,
  });
};
