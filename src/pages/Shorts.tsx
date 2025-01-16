import { useSession } from "@supabase/auth-helpers-react";
import { ShortsFeed } from "@/components/home/ShortsFeed";
import { UploadShortButton } from "@/components/home/UploadShortButton";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Shorts() {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!session?.user?.id) return;

    // Subscribe to real-time updates for posts
    const channel = supabase
      .channel('public:posts')
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
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, queryClient, toast]);

  return (
    <div className="min-h-screen bg-luxury-dark">
      <div className="fixed inset-0 flex items-center justify-center">
        <ShortsFeed />
      </div>
      {session && <UploadShortButton />}
    </div>
  );
}