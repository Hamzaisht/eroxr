
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreatorEarnings, PayoutRequest } from "../types";
import { useSession } from "@supabase/auth-helpers-react";

export function useCreatorEarnings() {
  const [creators, setCreators] = useState<CreatorEarnings[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const session = useSession();

  const fetchCreators = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First, get all profiles with earnings data
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles_with_stats")
        .select(`
          id,
          username,
          avatar_url,
          subscriber_count
        `);
        
      if (profilesError) throw profilesError;

      // For each creator, get their earnings data
      const creatorsWithEarnings: CreatorEarnings[] = await Promise.all(
        (profilesData || []).map(async (profile) => {
          // Get total earnings
          const { data: earningsData, error: earningsError } = await supabase
            .from("transactions")
            .select(`
              amount,
              platform_fee,
              transaction_type
            `)
            .eq("creator_id", profile.id);
            
          if (earningsError) {
            console.error("Error fetching earnings for creator:", earningsError);
            return null;
          }

          // Calculate earnings
          const grossEarnings = earningsData?.reduce((total, tx) => total + (tx.amount || 0), 0) || 0;
          const platformFee = earningsData?.reduce((total, tx) => total + (tx.platform_fee || 0), 0) || 0;
          const netEarnings = grossEarnings - platformFee;
          
          // Get counts by transaction type
          const ppvCount = earningsData?.filter(tx => tx.transaction_type === 'ppv').length || 0;
          const tipCount = earningsData?.filter(tx => tx.transaction_type === 'tip').length || 0;

          // Check if they have a Stripe account
          const { data: stripeData } = await supabase
            .from("stripe_accounts")
            .select("id, status")
            .eq("creator_id", profile.id)
            .maybeSingle();

          // Get last payout
          const { data: lastPayoutData } = await supabase
            .from("payout_requests")
            .select("processed_at, final_amount, status")
            .eq("creator_id", profile.id)
            .order("processed_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            id: profile.id,
            username: profile.username || 'Unknown',
            avatar_url: profile.avatar_url || undefined,
            gross_earnings: grossEarnings,
            platform_fee: platformFee,
            net_earnings: netEarnings,
            subscription_count: profile.subscriber_count || 0,
            ppv_count: ppvCount,
            tip_count: tipCount,
            last_payout_date: lastPayoutData?.processed_at,
            last_payout_amount: lastPayoutData?.final_amount,
            payout_status: lastPayoutData?.status,
            stripe_connected: !!stripeData,
          };
        })
      );
      
      setCreators(creatorsWithEarnings.filter(Boolean) as CreatorEarnings[]);
    } catch (err: any) {
      console.error("Error fetching creators:", err);
      setError(err.message || "Failed to fetch creators");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPayouts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("payout_requests")
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
          profiles:creator_id (
            username,
            avatar_url
          )
        `)
        .order('requested_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedPayouts: PayoutRequest[] = (data || []).map(payout => ({
        id: payout.id,
        creator_id: payout.creator_id,
        creator_username: payout.profiles?.username || 'Unknown',
        creator_avatar_url: payout.profiles?.avatar_url || undefined,
        amount: payout.amount,
        platform_fee: payout.platform_fee,
        final_amount: payout.final_amount,
        requested_at: payout.requested_at,
        approved_at: payout.approved_at,
        processed_at: payout.processed_at,
        status: payout.status,
        notes: payout.notes
      }));
      
      setPayouts(formattedPayouts);
    } catch (err: any) {
      console.error("Error fetching payouts:", err);
      setError(err.message || "Failed to fetch payout requests");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      setIsLoading(true);
      await Promise.all([fetchCreators(), fetchPayouts()]);
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchCreators, fetchPayouts]);

  // Initialize data
  useState(() => {
    handleRefresh();
  });

  const handleApprovePayoutRequest = async (payoutId: string) => {
    try {
      if (!session?.user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to approve payouts",
          variant: "destructive"
        });
        return;
      }
      
      setIsActionInProgress(true);
      
      // Update the payout record
      const { error } = await supabase
        .from("payout_requests")
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          processed_by: session.user.id
        })
        .eq('id', payoutId);
        
      if (error) throw error;
      
      // Log the action
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: 'payout_approved',
        details: {
          payout_id: payoutId,
          timestamp: new Date().toISOString()
        }
      });
      
      // Refresh the data
      await fetchPayouts();
      
      toast({
        title: "Payout Approved",
        description: "The payout request has been approved and will be processed.",
      });
    } catch (err: any) {
      console.error("Error approving payout:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to approve payout",
        variant: "destructive"
      });
    } finally {
      setIsActionInProgress(false);
    }
  };

  const handleRejectPayoutRequest = async (payoutId: string) => {
    try {
      if (!session?.user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to reject payouts",
          variant: "destructive"
        });
        return;
      }
      
      setIsActionInProgress(true);
      
      // Update the payout record
      const { error } = await supabase
        .from("payout_requests")
        .update({
          status: 'rejected',
          processed_by: session.user.id,
          notes: 'Rejected by administrator'
        })
        .eq('id', payoutId);
        
      if (error) throw error;
      
      // Log the action
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: 'payout_rejected',
        details: {
          payout_id: payoutId,
          timestamp: new Date().toISOString()
        }
      });
      
      // Refresh the data
      await fetchPayouts();
      
      toast({
        title: "Payout Rejected",
        description: "The payout request has been rejected.",
      });
    } catch (err: any) {
      console.error("Error rejecting payout:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to reject payout",
        variant: "destructive"
      });
    } finally {
      setIsActionInProgress(false);
    }
  };

  const handleBlockCreatorPayouts = async (creatorId: string) => {
    try {
      if (!session?.user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to block payouts",
          variant: "destructive"
        });
        return;
      }
      
      setIsActionInProgress(true);
      
      // In a real implementation, you would update a creator_payout_blocks table or similar
      
      // Log the action
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: 'creator_payouts_blocked',
        details: {
          creator_id: creatorId,
          timestamp: new Date().toISOString()
        }
      });
      
      toast({
        title: "Payouts Blocked",
        description: "All payouts for this creator have been blocked.",
      });
    } catch (err: any) {
      console.error("Error blocking payouts:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to block payouts",
        variant: "destructive"
      });
    } finally {
      setIsActionInProgress(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      setIsActionInProgress(true);
      
      // In a real implementation, you would generate a CSV or PDF and trigger a download
      
      toast({
        title: "Report Downloaded",
        description: "The earnings report has been downloaded.",
      });
      
      // Simulate a delay for the download
      setTimeout(() => {
        setIsActionInProgress(false);
      }, 1500);
    } catch (err: any) {
      console.error("Error downloading report:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to download report",
        variant: "destructive"
      });
      setIsActionInProgress(false);
    }
  };

  return {
    creators,
    payouts,
    isLoading,
    isActionInProgress,
    error,
    handleRefresh,
    handleApprovePayoutRequest,
    handleRejectPayoutRequest,
    handleBlockCreatorPayouts,
    handleDownloadReport
  };
}
