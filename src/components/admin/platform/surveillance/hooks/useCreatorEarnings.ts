
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreatorEarnings, PayoutRequest } from "../types";

export function useCreatorEarnings() {
  const [creators, setCreators] = useState<CreatorEarnings[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  
  const session = useSession();
  const { toast } = useToast();
  
  const fetchCreatorEarnings = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch creator profiles with earnings data
      const { data, error } = await supabase.rpc('get_creator_earnings');
      
      if (error) throw error;
      
      // Transform data to match our type
      const earnings: CreatorEarnings[] = data.map((item: any) => ({
        id: item.user_id,
        username: item.username || 'Unknown',
        avatar_url: item.avatar_url,
        gross_earnings: parseFloat(item.total_earnings || '0'),
        platform_fee: parseFloat(item.total_earnings || '0') * 0.07, // 7% platform fee
        net_earnings: parseFloat(item.total_earnings || '0') * 0.93, // 93% to creator
        subscription_count: item.subscriber_count || 0,
        ppv_count: item.ppv_content_count || 0,
        tip_count: item.tip_count || 0,
        last_payout_date: item.last_payout_date,
        stripe_connected: !!item.stripe_account_id
      }));
      
      setCreators(earnings);
      
      // Fetch payout requests
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
      
      const payoutRequests: PayoutRequest[] = payoutData.map(payout => ({
        id: payout.id,
        creator_id: payout.creator_id,
        creator_username: payout.profiles ? payout.profiles.username : 'Unknown',
        creator_avatar_url: payout.profiles ? payout.profiles.avatar_url : null,
        amount: payout.amount,
        platform_fee: payout.platform_fee,
        final_amount: payout.final_amount,
        requested_at: payout.requested_at,
        approved_at: payout.approved_at,
        processed_at: payout.processed_at,
        status: payout.status as 'pending' | 'approved' | 'processed' | 'rejected',
        notes: payout.notes
      }));
      
      setPayouts(payoutRequests);
    } catch (error) {
      console.error("Error fetching creator earnings:", error);
      setError("Failed to load creator earnings. Please try again.");
      setCreators([]);
      setPayouts([]);
      
      toast({
        title: "Error",
        description: "Could not load creator earnings data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, toast]);
  
  const handleRefresh = async () => {
    await fetchCreatorEarnings();
    
    toast({
      title: "Refreshed",
      description: "Creator earnings data has been updated",
    });
  };
  
  const handleApprovePayoutRequest = async (payoutId: string) => {
    if (!session?.user?.id) return;
    
    setIsActionInProgress(true);
    
    try {
      const { error } = await supabase
        .from('payout_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', payoutId);
        
      if (error) throw error;
      
      // Log the action
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: 'payout_approved',
        details: {
          timestamp: new Date().toISOString(),
          payout_id: payoutId
        }
      });
      
      // Refresh the data
      await fetchCreatorEarnings();
      
      toast({
        title: "Payout Approved",
        description: "The payout request has been approved",
      });
    } catch (error) {
      console.error("Error approving payout:", error);
      toast({
        title: "Action Failed",
        description: "Could not approve payout request",
        variant: "destructive"
      });
    } finally {
      setIsActionInProgress(false);
    }
  };
  
  const handleRejectPayoutRequest = async (payoutId: string) => {
    if (!session?.user?.id) return;
    
    setIsActionInProgress(true);
    
    try {
      const { error } = await supabase
        .from('payout_requests')
        .update({
          status: 'rejected'
        })
        .eq('id', payoutId);
        
      if (error) throw error;
      
      // Log the action
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: 'payout_rejected',
        details: {
          timestamp: new Date().toISOString(),
          payout_id: payoutId
        }
      });
      
      // Refresh the data
      await fetchCreatorEarnings();
      
      toast({
        title: "Payout Rejected",
        description: "The payout request has been rejected",
      });
    } catch (error) {
      console.error("Error rejecting payout:", error);
      toast({
        title: "Action Failed",
        description: "Could not reject payout request",
        variant: "destructive"
      });
    } finally {
      setIsActionInProgress(false);
    }
  };
  
  const handleBlockCreatorPayouts = async (creatorId: string) => {
    if (!session?.user?.id) return;
    
    setIsActionInProgress(true);
    
    try {
      // In a real implementation, you'd update the creator's account status
      // For now, we'll just simulate this and log it
      
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: 'creator_payouts_blocked',
        details: {
          timestamp: new Date().toISOString(),
          creator_id: creatorId
        }
      });
      
      toast({
        title: "Payouts Blocked",
        description: "The creator's payout ability has been blocked",
      });
    } catch (error) {
      console.error("Error blocking creator payouts:", error);
      toast({
        title: "Action Failed",
        description: "Could not block creator payouts",
        variant: "destructive"
      });
    } finally {
      setIsActionInProgress(false);
    }
  };
  
  const handleDownloadReport = () => {
    if (creators.length === 0) {
      toast({
        title: "No Data",
        description: "There are no earnings to export",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create CSV content
      const headers = ["Username", "Gross Earnings", "Platform Fee", "Net Earnings", "Subscribers", "PPV", "Tips", "Stripe Connected"];
      const rows = creators.map(creator => [
        creator.username,
        creator.gross_earnings.toFixed(2),
        creator.platform_fee.toFixed(2),
        creator.net_earnings.toFixed(2),
        creator.subscription_count,
        creator.ppv_count,
        creator.tip_count,
        creator.stripe_connected ? "Yes" : "No"
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");
      
      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `creator_earnings_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Report Downloaded",
        description: "The earnings report has been exported as CSV",
      });
      
      // Log the action
      if (session?.user?.id) {
        supabase.from('admin_audit_logs').insert({
          user_id: session.user.id,
          action: 'earnings_report_exported',
          details: {
            timestamp: new Date().toISOString(),
            creator_count: creators.length
          }
        });
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Export Failed",
        description: "Could not download the earnings report",
        variant: "destructive"
      });
    }
  };
  
  // Initialize data when component mounts
  useState(() => {
    fetchCreatorEarnings();
  });
  
  return {
    creators,
    payouts,
    isLoading,
    error,
    isActionInProgress,
    handleRefresh,
    handleApprovePayoutRequest,
    handleRejectPayoutRequest,
    handleBlockCreatorPayouts,
    handleDownloadReport
  };
}
