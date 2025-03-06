
import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

export const useViewTracking = () => {
  const session = useSession();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Track view for analytics
        if (session?.user) {
          await supabase.from('user_analytics').insert({
            user_id: session.user.id,
            page: 'dating',
            timestamp: new Date().toISOString(),
          }).select();
        }
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };
    
    trackPageView();
  }, [session]);
};
