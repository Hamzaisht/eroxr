
import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { CreatorEarnings, PayoutRequest } from '@/types/finance';

export function useCreatorEarnings() {
  const [earnings, setEarnings] = useState<CreatorEarnings[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<PayoutRequest[]>([]);
  const [approvedPayouts, setApprovedPayouts] = useState<PayoutRequest[]>([]);
  const [processedPayouts, setProcessedPayouts] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = useSupabaseClient();
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch creator earnings
        const { data: earningsData, error: earningsError } = await supabase
          .from('creator_metrics')
          .select('*, profiles(username, avatar_url)')
          .order('earnings', { ascending: false })
          .limit(20);
          
        if (earningsError) throw earningsError;
        
        // Transform earnings data
        const transformedEarnings: CreatorEarnings[] = (earningsData || []).map(item => ({
          id: item.id,
          user_id: item.user_id,
          creator_id: item.user_id, // Ensure compatibility
          username: item.profiles?.username || 'Unknown',
          avatar_url: item.profiles?.avatar_url,
          total_earnings: item.earnings || 0,
          current_balance: item.earnings - (item.payout_total || 0),
          last_payout_date: item.last_payout_date,
          last_payout_amount: item.last_payout_amount || 0,
          subscriber_count: item.subscriber_count || 0,
          tip_count: item.tip_count || 0,
          ppv_count: item.ppv_count || 0,
          subscription_earnings: item.subscription_earnings || 0,
          tip_earnings: item.tip_earnings || 0,
          ppv_earnings: item.ppv_earnings || 0
        }));
        
        setEarnings(transformedEarnings);
        
        // Fetch pending payouts
        const { data: pendingData, error: pendingError } = await supabase
          .from('payout_requests')
          .select('*, profiles:creator_id(username, avatar_url)')
          .eq('status', 'pending')
          .order('requested_at', { ascending: false });
          
        if (pendingError) throw pendingError;
        
        // Transform pending payouts
        const transformedPending: PayoutRequest[] = (pendingData || []).map(item => ({
          id: item.id,
          creator_id: item.creator_id,
          amount: item.amount,
          platform_fee: item.platform_fee,
          final_amount: item.final_amount,
          requested_at: item.requested_at,
          status: item.status,
          notes: item.notes,
          username: item.profiles?.username,
          creator_username: item.profiles?.username, // Ensure compatibility
          avatar_url: item.profiles?.avatar_url
        }));
        
        setPendingPayouts(transformedPending);
        
        // Fetch approved payouts
        const { data: approvedData, error: approvedError } = await supabase
          .from('payout_requests')
          .select('*, profiles:creator_id(username, avatar_url)')
          .eq('status', 'approved')
          .order('approved_at', { ascending: false });
          
        if (approvedError) throw approvedError;
        
        // Transform approved payouts
        const transformedApproved: PayoutRequest[] = (approvedData || []).map(item => ({
          id: item.id,
          creator_id: item.creator_id,
          amount: item.amount,
          platform_fee: item.platform_fee,
          final_amount: item.final_amount,
          requested_at: item.requested_at,
          approved_at: item.approved_at,
          status: item.status,
          notes: item.notes,
          username: item.profiles?.username,
          creator_username: item.profiles?.username, // Ensure compatibility
          avatar_url: item.profiles?.avatar_url
        }));
        
        setApprovedPayouts(transformedApproved);
        
        // Fetch processed payouts
        const { data: processedData, error: processedError } = await supabase
          .from('payout_requests')
          .select('*, profiles:creator_id(username, avatar_url)')
          .eq('status', 'processed')
          .order('processed_at', { ascending: false });
          
        if (processedError) throw processedError;
        
        // Transform processed payouts
        const transformedProcessed: PayoutRequest[] = (processedData || []).map(item => ({
          id: item.id,
          creator_id: item.creator_id,
          amount: item.amount,
          platform_fee: item.platform_fee,
          final_amount: item.final_amount,
          requested_at: item.requested_at,
          approved_at: item.approved_at,
          processed_at: item.processed_at,
          processed_by: item.processed_by,
          status: item.status,
          notes: item.notes,
          username: item.profiles?.username,
          creator_username: item.profiles?.username, // Ensure compatibility
          avatar_url: item.profiles?.avatar_url
        }));
        
        setProcessedPayouts(transformedProcessed);
      } catch (err) {
        console.error('Error fetching earnings data:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [supabase]);
  
  return {
    earnings,
    pendingPayouts,
    approvedPayouts,
    processedPayouts,
    isLoading,
    error
  };
}
