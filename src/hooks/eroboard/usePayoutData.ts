
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import type { PayoutInfo } from "./types";

export function usePayoutData() {
  const session = useSession();
  const [latestPayout, setLatestPayout] = useState<PayoutInfo | null>(null);

  const fetchPayoutData = useCallback(async () => {
    if (!session?.user?.id) return null;

    try {
      const { data: payoutData, error: payoutError } = await supabase
        .from('payout_requests')
        .select('status, processed_at')
        .eq('creator_id', session.user.id)
        .order('requested_at', { ascending: false })
        .limit(1);
        
      if (payoutError) {
        throw payoutError;
      }
      
      // If we have data, set it, otherwise set null
      setLatestPayout(payoutData && payoutData.length > 0 ? payoutData[0] : null);
      return payoutData && payoutData.length > 0 ? payoutData[0] : null;
    } catch (error) {
      console.error("Error fetching payout data:", error);
      return null;
    }
  }, [session?.user?.id]);

  return {
    latestPayout,
    setLatestPayout,
    fetchPayoutData
  };
}
