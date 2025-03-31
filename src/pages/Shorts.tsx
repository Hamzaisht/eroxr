
import { useSession } from "@supabase/auth-helpers-react";
import { ShortsFeed } from "@/components/home/ShortsFeed";
import { UploadVideoButton } from "@/components/home/UploadVideoButton";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useLocation, useNavigate } from "react-router-dom";

export default function Shorts() {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const specificShortId = queryParams.get('id');

  // Handle direct links to a specific short
  useEffect(() => {
    if (specificShortId) {
      // In a real implementation, you would use this ID to scroll to the specific short
      console.log('Viewing specific short:', specificShortId);
      
      // If needed, you could pre-fetch the specific short data here
      // This would ensure it's available when the feed loads
    }
  }, [specificShortId]);

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
          <ShortsFeed specificShortId={specificShortId} />
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
