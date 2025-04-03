
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { CreatorEarnings, PayoutRequest } from "../types";
import { useToast } from "@/hooks/use-toast";

export function useCreatorEarnings() {
  const [creatorEarnings, setCreatorEarnings] = useState<CreatorEarnings[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<PayoutRequest[]>([]);
  const [processingPayouts, setProcessingPayouts] = useState<PayoutRequest[]>([]);
  const [completedPayouts, setCompletedPayouts] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    fetchEarnings();
  }, []);

  // Create subscription for real-time updates to payouts
  useEffect(() => {
    const channel = supabase
      .channel('creator-earnings-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'payout_requests' 
      }, () => {
        fetchEarnings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEarnings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch creator earnings data with profile information
      const { data: earnings, error: earningsError } = await supabase
        .from('payout_requests')
        .select(`
          id,
          creator_id,
          amount,
          platform_fee,
          final_amount,
          requested_at,
          approved_at,
          processed_at,
          status,
          notes,
          profiles:creator_id(username, avatar_url)
        `)
        .order('requested_at', { ascending: false });
      
      if (earningsError) {
        console.error("Error fetching earnings:", earningsError);
        setError("Could not fetch earnings data");
        return;
      }

      // Process earnings data
      const processedEarnings: CreatorEarnings[] = earnings.map(earning => {
        const profile = earning.profiles || {};
        return {
          id: earning.id,
          user_id: earning.creator_id,
          username: profile.username || 'Unknown User',
          avatar_url: profile.avatar_url || null,
          gross_earnings: parseFloat(earning.amount) || 0,
          net_earnings: parseFloat(earning.final_amount) || 0,
          platform_fee: parseFloat(earning.platform_fee) || 0,
          subscription_count: 0, // These fields would need additional queries
          ppv_count: 0,
          tip_count: 0,
          last_payout_date: earning.processed_at || null,
          last_payout_amount: parseFloat(earning.final_amount) || 0,
          payout_status: earning.status,
          stripe_connected: true, // Default assumption
          source: determineEarningSource(earning),
          status: earning.status,
          amount: earning.amount.toString(),
          description: earning.notes || determineEarningDescription(earning),
          created_at: earning.requested_at
        };
      });

      // Group payouts by status
      const pending = earnings.filter(p => p.status === 'pending').map(formatPayoutRequest);
      const processing = earnings.filter(p => p.status === 'approved').map(formatPayoutRequest);
      const completed = earnings.filter(p => p.status === 'processed').map(formatPayoutRequest);
      
      setCreatorEarnings(processedEarnings);
      setPendingPayouts(pending);
      setProcessingPayouts(processing);
      setCompletedPayouts(completed);
    } catch (err) {
      console.error('Error fetching earnings data:', err);
      setError('Failed to load earnings data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine earning source based on data
  const determineEarningSource = (earning: any): string => {
    const description = earning.notes?.toLowerCase() || '';
    if (description.includes('subscription')) return 'subscription';
    if (description.includes('ppv') || description.includes('premium')) return 'ppv';
    if (description.includes('tip') || description.includes('gift')) return 'tips';
    if (description.includes('direct') || description.includes('sale')) return 'direct';
    return 'subscription'; // Default
  };

  // Helper function to determine description if not provided
  const determineEarningDescription = (earning: any): string => {
    const source = determineEarningSource(earning);
    switch (source) {
      case 'subscription': return 'Monthly subscriptions';
      case 'ppv': return 'Premium content sales';
      case 'tips': return 'Fan tips and gifts';
      case 'direct': return 'Direct content sales';
      default: return 'Platform earnings';
    }
  };

  // Helper function to format payout requests
  const formatPayoutRequest = (payout: any): PayoutRequest => {
    const profile = payout.profiles || {};
    return {
      id: payout.id,
      creator_id: payout.creator_id,
      creator_username: profile.username || 'Unknown User',
      creator_avatar_url: profile.avatar_url || null,
      amount: parseFloat(payout.amount) || 0,
      platform_fee: parseFloat(payout.platform_fee) || 0,
      final_amount: parseFloat(payout.final_amount) || 0,
      requested_at: payout.requested_at,
      approved_at: payout.approved_at || null,
      processed_at: payout.processed_at || null,
      status: payout.status
    };
  };

  const handlePayoutAction = async (payoutId: string, action: 'approve' | 'reject' | 'process') => {
    try {
      // Apply action to the payout request in Supabase
      let updates = {};
      
      if (action === 'approve') {
        updates = {
          status: 'approved',
          approved_at: new Date().toISOString()
        };
      } else if (action === 'reject') {
        updates = {
          status: 'rejected'
        };
      } else if (action === 'process') {
        updates = {
          status: 'processed',
          processed_at: new Date().toISOString(),
          processed_by: session?.user?.id
        };
      }
      
      const { error } = await supabase
        .from('payout_requests')
        .update(updates)
        .eq('id', payoutId);
        
      if (error) {
        console.error(`Error ${action}ing payout:`, error);
        toast({
          title: "Action Failed",
          description: `Could not ${action} the payout. Please try again.`,
          variant: "destructive"
        });
        return;
      }
      
      // Refresh data after successful action
      await fetchEarnings();
      
      toast({
        title: `Payout ${action === 'approve' ? 'Approved' : action === 'process' ? 'Processed' : 'Rejected'}`,
        description: `Payout has been ${action === 'approve' ? 'approved' : action === 'process' ? 'processed' : 'rejected'} successfully.`
      });
      
    } catch (err) {
      console.error(`Error processing payout action ${action}:`, err);
      toast({
        title: "Action Failed",
        description: `Could not ${action} the payout. Please try again.`,
        variant: "destructive"
      });
    }
  };

  return {
    creatorEarnings,
    pendingPayouts,
    processingPayouts,
    completedPayouts,
    isLoading,
    error,
    fetchEarnings,
    handlePayoutAction
  };
}
