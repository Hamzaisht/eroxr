
import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export const useRealtimeShorts = (refetch: () => void) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Listen for new shorts
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('public:video_posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `video_urls.neq.null`
        },
        (payload) => {
          console.log('Real-time post update:', payload);
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New short",
              description: "A new short has been posted!",
            });
            refetch();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, queryClient, toast, refetch]);

  // Listen for new comments
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('public:comments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments'
        },
        (payload) => {
          console.log('New comment:', payload);
          refetch();
          
          toast({
            title: "New comment",
            description: "Someone commented on a short",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, refetch, toast]);

  return null;
};
