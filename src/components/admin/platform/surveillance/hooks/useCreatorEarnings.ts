import { useCallback, useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { PayoutRequest, CreatorEarnings } from "../types";

export function useCreatorEarnings() {
  const [earnings, setEarnings] = useState<CreatorEarnings[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<PayoutRequest[]>([]);
  const [approvedPayouts, setApprovedPayouts] = useState<PayoutRequest[]>([]);
  const [processedPayouts, setProcessedPayouts] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const fetchEarnings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch creator earnings data
      const { data: earningsData, error: earningsError } = await supabase
        .from('creator_earnings')
        .select(`
          *,
          profile:creator_id(username, avatar_url)
        `)
        .order('total_earnings', { ascending: false });
        
      if (earningsError) throw earningsError;
      
      // Fetch pending payout requests
      const { data: pendingData, error: pendingError } = await supabase
        .from('payout_requests')
        .select(`
          *,
          creator:creator_id(username, avatar_url)
        `)
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });
        
      if (pendingError) throw pendingError;
      
      // Fetch approved payout requests
      const { data: approvedData, error: approvedError } = await supabase
        .from('payout_requests')
        .select(`
          *,
          creator:creator_id(username, avatar_url)
        `)
        .eq('status', 'approved')
        .order('approved_at', { ascending: false });
        
      if (approvedError) throw approvedError;
      
      // Fetch processed payout requests
      const { data: processedData, error: processedError } = await supabase
        .from('payout_requests')
        .select(`
          *,
          creator:creator_id(username, avatar_url)
        `)
        .eq('status', 'processed')
        .order('processed_at', { ascending: false })
        .limit(50);
        
      if (processedError) throw processedError;
      
      // Format earnings data
      const formattedEarnings: CreatorEarnings[] = (earningsData || []).map(item => ({
        creator_id: item.creator_id,
        username: item.profile?.username || 'Unknown',
        avatar_url: item.profile?.avatar_url,
        total_earnings: item.total_earnings || 0,
        subscription_earnings: item.subscription_earnings || 0,
        tip_earnings: item.tip_earnings || 0,
        ppv_earnings: item.ppv_earnings || 0,
        last_payout_date: item.last_payout_date,
        last_payout_amount: item.last_payout_amount
      }));
      
      // Format payout requests
      const formattedPending: PayoutRequest[] = (pendingData || []).map(item => ({
        ...item,
        creator_username: item.creator?.username || 'Unknown'
      }));
      
      const formattedApproved: PayoutRequest[] = (approvedData || []).map(item => ({
        ...item,
        creator_username: item.creator?.username || 'Unknown'
      }));
      
      const formattedProcessed: PayoutRequest[] = (processedData || []).map(item => ({
        ...item,
        creator_username: item.creator?.username || 'Unknown'
      }));
      
      setEarnings(formattedEarnings);
      setPendingPayouts(formattedPending);
      setApprovedPayouts(formattedApproved);
      setProcessedPayouts(formattedProcessed);
      
      console.log(`Loaded ${formattedEarnings.length} creator earnings records`);
      console.log(`Loaded ${formattedPending.length} pending payouts`);
      console.log(`Loaded ${formattedApproved.length} approved payouts`);
      
    } catch (err) {
      console.error('Error fetching earnings data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch earnings data'));
      toast({
        title: 'Error',
        description: 'Failed to load earnings data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast]);
  
  // Load data on component mount
  useEffect(() => {
    fetchEarnings();
    
    // Set up realtime subscription for payout requests
    const channel = supabase
      .channel('payout-requests-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'payout_requests',
      }, () => {
        console.log('Payout request changed, refreshing data');
        fetchEarnings();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEarnings, supabase]);
  
  // Function to approve pending payouts
  const approvePayouts = async (payoutIds: string[]) => {
    try {
      setIsLoading(true);
      
      // Update payout status to approved
      const { error } = await supabase
        .from('payout_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .in('id', payoutIds);
        
      if (error) throw error;
      
      // Log admin action
      await supabase.from('admin_logs').insert(
        payoutIds.map(id => ({
          admin_id: supabase.auth.getUser().then(res => res.data.user?.id),
          action: 'approve_payout',
          action_type: 'finance',
          target_type: 'payout',
          target_id: id,
          details: {
            timestamp: new Date().toISOString(),
            payout_id: id
          }
        }))
      );
      
      toast({
        title: 'Payouts Approved',
        description: `Successfully approved ${payoutIds.length} payout requests`
      });
      
      // Refresh data
      await fetchEarnings();
      return true;
      
    } catch (err) {
      console.error('Error approving payouts:', err);
      toast({
        title: 'Error',
        description: 'Failed to approve payout requests',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to process approved payouts
  const processPayouts = async (payoutIds: string[]) => {
    try {
      setIsLoading(true);
      
      // Update payout status to processed
      const { error } = await supabase
        .from('payout_requests')
        .update({
          status: 'processed',
          processed_at: new Date().toISOString(),
          processed_by: supabase.auth.getUser().then(res => res.data.user?.id)
        })
        .in('id', payoutIds);
        
      if (error) throw error;
      
      // Log admin action
      await supabase.from('admin_logs').insert(
        payoutIds.map(id => ({
          admin_id: supabase.auth.getUser().then(res => res.data.user?.id),
          action: 'process_payout',
          action_type: 'finance',
          target_type: 'payout',
          target_id: id,
          details: {
            timestamp: new Date().toISOString(),
            payout_id: id
          }
        }))
      );
      
      toast({
        title: 'Payouts Processed',
        description: `Successfully processed ${payoutIds.length} payout requests`
      });
      
      // Refresh data
      await fetchEarnings();
      return true;
      
    } catch (err) {
      console.error('Error processing payouts:', err);
      toast({
        title: 'Error',
        description: 'Failed to process payout requests',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to reject payout requests
  const rejectPayouts = async (payoutIds: string[], reason: string = 'Administrative decision') => {
    try {
      setIsLoading(true);
      
      // Update payout status to rejected
      const { error } = await supabase
        .from('payout_requests')
        .update({
          status: 'rejected',
          notes: reason
        })
        .in('id', payoutIds);
        
      if (error) throw error;
      
      // Log admin action
      await supabase.from('admin_logs').insert(
        payoutIds.map(id => ({
          admin_id: supabase.auth.getUser().then(res => res.data.user?.id),
          action: 'reject_payout',
          action_type: 'finance',
          target_type: 'payout',
          target_id: id,
          details: {
            timestamp: new Date().toISOString(),
            payout_id: id,
            reason: reason
          }
        }))
      );
      
      toast({
        title: 'Payouts Rejected',
        description: `Rejected ${payoutIds.length} payout requests`
      });
      
      // Refresh data
      await fetchEarnings();
      return true;
      
    } catch (err) {
      console.error('Error rejecting payouts:', err);
      toast({
        title: 'Error',
        description: 'Failed to reject payout requests',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    earnings,
    pendingPayouts,
    approvedPayouts,
    processedPayouts,
    isLoading,
    error,
    fetchEarnings,
    approvePayouts,
    rejectPayouts,
    processPayouts
  };
}
