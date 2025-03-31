
import { useSession } from "@supabase/auth-helpers-react";
import { ShortsFeed } from "@/components/home/ShortsFeed";
import { UploadVideoButton } from "@/components/home/UploadVideoButton";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useMediaQuery } from "@/hooks/use-mobile";

export default function Shorts() {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 640px)");

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
              duration: isMobile ? 3000 : 5000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, queryClient, toast, isMobile]);

  return (
    <div className="min-h-screen bg-luxury-dark overflow-hidden">
      <ErrorBoundary fallback={<div className="p-4 md:p-8 text-center">Something went wrong loading Eros. Please try refreshing.</div>}>
        <div className="fixed inset-0 flex items-center justify-center">
          <ShortsFeed />
        </div>
        {session && (
          <div className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-8 right-8'} z-50`}>
            <UploadVideoButton />
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
}
