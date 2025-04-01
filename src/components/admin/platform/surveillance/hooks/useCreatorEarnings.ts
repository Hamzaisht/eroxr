
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreatorEarnings, PayoutRequest, StripeAccount } from "../types";

export function useCreatorEarnings() {
  const [creatorEarnings, setCreatorEarnings] = useState<CreatorEarnings[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<PayoutRequest[]>([]);
  const [processingPayouts, setProcessingPayouts] = useState<PayoutRequest[]>([]);
  const [completedPayouts, setCompletedPayouts] = useState<PayoutRequest[]>([]);
  const [stripeAccounts, setStripeAccounts] = useState<StripeAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const session = useSession();
  const { toast } = useToast();
  
  const fetchCreatorEarnings = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch creator earnings data
      const { data: earningsData, error: earningsError } = await supabase
        .rpc('get_creator_earnings')
        .limit(50);
        
      if (earningsError) throw earningsError;
      
      // Transform data into the expected format
      const formattedEarnings: CreatorEarnings[] = earningsData.map((earning: any) => ({
        id: earning.creator_id,
        username: earning.username || 'Unknown Creator',
        avatar_url: earning.avatar_url || null,
        gross_earnings: parseFloat(earning.gross_earnings) || 0,
        net_earnings: parseFloat(earning.net_earnings) || 0,
        platform_fee: parseFloat(earning.platform_fee) || 0,
        subscription_count: earning.subscription_count || 0,
        ppv_count: earning.ppv_count || 0,
        tip_count: earning.tip_count || 0,
        last_payout_date: earning.last_payout_date,
        last_payout_amount: earning.last_payout_amount ? parseFloat(earning.last_payout_amount) : 0,
        payout_status: earning.payout_status || 'none',
        stripe_connected: earning.stripe_connected || false
      }));
      
      setCreatorEarnings(formattedEarnings);
      
      // Fetch payout requests data
      const { data: payoutData, error: payoutError } = await supabase
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
          profiles(username, avatar_url)
        `)
        .order('requested_at', { ascending: false });
        
      if (payoutError) throw payoutError;
      
      // Format payout data
      const formattedPayouts: PayoutRequest[] = payoutData.map(payout => ({
        id: payout.id,
        creator_id: payout.creator_id,
        creator_username: payout.profiles ? payout.profiles.username || 'Unknown' : 'Unknown',
        creator_avatar_url: payout.profiles ? payout.profiles.avatar_url || null : null,
        amount: parseFloat(payout.amount) || 0,
        platform_fee: parseFloat(payout.platform_fee) || 0,
        final_amount: parseFloat(payout.final_amount) || 0,
        requested_at: payout.requested_at,
        approved_at: payout.approved_at,
        processed_at: payout.processed_at,
        status: payout.status as any,
        notes: payout.notes
      }));
      
      // Sort payouts by status
      setPendingPayouts(formattedPayouts.filter(p => p.status === 'pending'));
      setProcessingPayouts(formattedPayouts.filter(p => p.status === 'approved'));
      setCompletedPayouts(formattedPayouts.filter(p => p.status === 'processed'));
      
      // Fetch Stripe account data
      const { data: stripeData, error: stripeError } = await supabase
        .from('stripe_accounts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (stripeError) throw stripeError;
      
      setStripeAccounts(stripeData);
      
    } catch (error) {
      console.error("Error fetching creator earnings:", error);
      setError("Failed to load creator earnings data. Please try again.");
      toast({
        title: "Error",
        description: "Could not load creator earnings data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, toast]);
  
  const handlePayoutAction = useCallback(async (payoutId: string, action: 'approve' | 'reject' | 'process') => {
    if (!session?.user?.id) return false;
    
    try {
      let status = '';
      let fieldToUpdate = {};
      
      switch (action) {
        case 'approve':
          status = 'approved';
          fieldToUpdate = { 
            status, 
            approved_at: new Date().toISOString() 
          };
          break;
        case 'reject':
          status = 'rejected';
          fieldToUpdate = { status };
          break;
        case 'process':
          status = 'processed';
          fieldToUpdate = { 
            status, 
            processed_at: new Date().toISOString(),
            processed_by: session.user.id
          };
          break;
      }
      
      // Update payout status
      const { error } = await supabase
        .from('payout_requests')
        .update(fieldToUpdate)
        .eq('id', payoutId);
        
      if (error) throw error;
      
      // Log admin action
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: `ghost_payout_${action}`,
        details: {
          timestamp: new Date().toISOString(),
          payout_id: payoutId,
          action
        }
      });
      
      // Refresh data
      await fetchCreatorEarnings();
      
      toast({
        title: "Payout Updated",
        description: `Payout has been ${status} successfully`,
      });
      
      return true;
    } catch (error) {
      console.error(`Error handling payout ${action}:`, error);
      toast({
        title: "Action Failed",
        description: `Could not ${action} the payout. Please try again.`,
        variant: "destructive"
      });
      return false;
    }
  }, [session?.user?.id, toast, fetchCreatorEarnings]);
  
  return {
    creatorEarnings,
    pendingPayouts,
    processingPayouts,
    completedPayouts,
    stripeAccounts,
    isLoading,
    error,
    fetchCreatorEarnings,
    handlePayoutAction
  };
}
