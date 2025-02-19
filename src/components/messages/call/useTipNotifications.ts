
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { TipData } from "./types";

export function useTipNotifications(recipientId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('tips')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tips',
          filter: `recipient_id=eq.${recipientId}`,
        },
        (payload) => {
          toast({
            title: "New Tip Received!",
            description: `${payload.new.amount} credits from ${payload.new.sender_name}`,
          });
          // Refresh tips total
          queryClient.invalidateQueries({ queryKey: ['tips_total', recipientId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recipientId, toast, queryClient]);
}
