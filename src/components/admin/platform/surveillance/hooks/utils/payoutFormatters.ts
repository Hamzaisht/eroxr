
import { useCallback } from "react";
import { CreatorEarnings, PayoutRequest } from "../../types";
import { supabase } from "@/integrations/supabase/client";

export const useMockPayoutRequests = () => {
  const fetchMockPayoutRequests = useCallback(async (): Promise<PayoutRequest[]> => {
    try {
      // For now, this uses mock data, but we could replace with real API calls later
      const { data, error } = await supabase
        .from('payout_requests')
        .select(`
          *,
          profiles:creator_id(
            username,
            avatar_url
          )
        `)
        .order('requested_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      // Format the data to match our interface
      return (data || []).map((request: any) => ({
        id: request.id,
        creator_id: request.creator_id,
        amount: request.amount,
        platform_fee: request.platform_fee,
        final_amount: request.final_amount,
        requested_at: request.requested_at,
        approved_at: request.approved_at,
        processed_at: request.processed_at,
        status: request.status,
        notes: request.notes,
        // Extra fields not in the type but useful for display
        creator_username: request.profiles?.[0]?.username || 'Unknown'
      }));
    } catch (error) {
      console.error("Error fetching payout requests:", error);
      return [];
    }
  }, []);
  
  return { fetchMockPayoutRequests };
};

export const useMockCreatorEarnings = () => {
  const fetchMockCreatorEarnings = useCallback(async (): Promise<CreatorEarnings[]> => {
    try {
      // Fetch real creator metrics from database
      const { data, error } = await supabase
        .from('creator_metrics')
        .select(`
          *,
          profiles:user_id(
            username,
            avatar_url
          )
        `)
        .order('earnings', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      // Map the data to our CreatorEarnings interface
      return (data || []).map((earnings: any) => ({
        id: earnings.id,
        creator_id: earnings.user_id,
        user_id: earnings.user_id,
        username: earnings.profiles?.[0]?.username || 'Unknown',
        avatar_url: earnings.profiles?.[0]?.avatar_url,
        total_earnings: earnings.earnings || 0,
        this_month: Math.floor(earnings.earnings * 0.3) || 0, // Mock calculation
        pending_earnings: Math.floor(earnings.earnings * 0.1) || 0, // Mock calculation
        fan_count: earnings.followers || 0,
        // Additional fields for display
        amount: earnings.earnings,
        source: 'subscription',
        status: 'active',
        description: 'Monthly subscription earnings',
        created_at: earnings.created_at,
        payout_status: 'available',
        last_payout_date: null
      }));
    } catch (error) {
      console.error("Error fetching creator earnings:", error);
      return [];
    }
  }, []);
  
  return { fetchMockCreatorEarnings };
};
