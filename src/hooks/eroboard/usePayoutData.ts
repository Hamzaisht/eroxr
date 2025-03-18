
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { PayoutInfo } from "./types";

export function usePayoutData() {
  const session = useSession();
  const [latestPayout, setLatestPayout] = useState<PayoutInfo | null>(null);

  const fetchPayoutData = useCallback(async () => {
    if (!session?.user?.id) return null;

    const { data: payoutData, error: payoutError } = await supabase
      .from('payout_requests')
      .select('status, processed_at')
      .eq('creator_id', session.user.id)
      .order('requested_at', { ascending: false })
      .limit(1)
      .single();

    if (payoutError && !payoutError.message.includes('No rows found')) {
      console.error("Error fetching payout data:", payoutError);
      return null;
    }

    setLatestPayout(payoutData || null);
    return payoutData;
  }, [session?.user?.id]);

  return {
    latestPayout,
    setLatestPayout,
    fetchPayoutData
  };
}
