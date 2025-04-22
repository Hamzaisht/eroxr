
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { transformRawAds } from "@/components/ads/utils/adTransformers";
import { DatingAd } from "@/components/ads/types/dating";

export function useUserDatingProfile(
  setUserProfile: (u: DatingAd | null) => void
) {
  const session = useSession();

  useEffect(() => {
    if (!session?.user?.id) {
      setUserProfile(null);
      return;
    }
    async function fetchUserProfile() {
      try {
        const { data, error } = await supabase
          .from("dating_ads")
          .select("*")
          .eq("user_id", session.user.id)
          .limit(1)
          .single();
        if (error) {
          console.error("Error fetching user profile:", error);
          return;
        }
        if (data) {
          setUserProfile(transformRawAds([data])[0]);
        }
      } catch (err) {
        console.error("Exception fetching user profile:", err);
      }
    }
    fetchUserProfile();
  }, [session, setUserProfile]);
}
