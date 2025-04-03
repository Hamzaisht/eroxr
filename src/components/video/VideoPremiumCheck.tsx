
import { useState, useEffect } from "react";
import { Session } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface VideoPremiumCheckProps {
  isPremium?: boolean;
  videoId?: string;
  session: Session | null;
}

export const VideoPremiumCheck = ({
  isPremium = false,
  videoId,
  session
}: VideoPremiumCheckProps) => {
  const [canPlayFull, setCanPlayFull] = useState(false);
  const [previewDuration, setPreviewDuration] = useState(5);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!session?.user?.id || !isPremium) {
        setCanPlayFull(!isPremium);
        return;
      }

      try {
        // Check if user is admin
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
          
        if (userRole?.role === 'admin') {
          setCanPlayFull(true);
          return;
        }

        // Check if user is premium
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_paying_customer, id_verification_status')
          .eq('id', session.user.id)
          .single();

        const hasAccess = 
          profile?.is_paying_customer === true || 
          profile?.id_verification_status === 'verified' ||
          session.user.id === videoId; // Owner can always see full content

        setCanPlayFull(hasAccess);
        
        // Set longer preview for non-premium users
        if (!hasAccess) {
          setPreviewDuration(10); // 10 seconds preview for non-premium
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
        setCanPlayFull(false);
      }
    };

    checkPremiumStatus();
  }, [session, isPremium, videoId]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!canPlayFull && e.currentTarget) {
      if (e.currentTarget.currentTime > previewDuration) {
        e.currentTarget.pause();
      }
    }
  };

  return {
    canPlayFull,
    previewDuration,
    handleTimeUpdate
  };
};
