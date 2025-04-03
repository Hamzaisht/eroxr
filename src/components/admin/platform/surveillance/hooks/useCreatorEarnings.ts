
import { useState, useEffect, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreatorEarnings, PayoutRequest } from "../types";
import { formatPayoutRequest, processEarningsData } from "./utils/payoutFormatters";

export function useCreatorEarnings() {
  const [earnings, setEarnings] = useState<CreatorEarnings[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<PayoutRequest[]>([]);
  const [approvedPayouts, setApprovedPayouts] = useState<PayoutRequest[]>([]);
  const [processedPayouts, setProcessedPayouts] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const session = useSession();
  
  const fetchAll = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch creator earnings
      const { data: earningsData, error: earningsError } = await supabase
        .from('creator_metrics')
        .select(`
          *,
          profiles:user_id(
            username,
            avatar_url
          )
        `)
        .order('earnings', { ascending: false })
        .limit(100);
        
      if (earningsError) throw earningsError;
      
      // Fetch payouts by status
      const { data: pendingData, error: pendingError } = await supabase
        .from('payout_requests')
        .select('*, profiles:creator_id(username)')
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });
        
      if (pendingError) throw pendingError;
        
      const { data: approvedData, error: approvedError } = await supabase
        .from('payout_requests')
        .select('*, profiles:creator_id(username)')
        .eq('status', 'approved')
        .order('approved_at', { ascending: false });
        
      if (approvedError) throw approvedError;
        
      const { data: processedData, error: processedError } = await supabase
        .from('payout_requests')
        .select('*, profiles:creator_id(username)')
        .eq('status', 'processed')
        .order('processed_at', { ascending: false })
        .limit(50);
        
      if (processedError) throw processedError;
      
      // Transform the data
      const processedEarnings = processEarningsData(earningsData || []);
      setEarnings(processedEarnings);
      
      // Transform and set the payout data with proper typing
      const typedPendingPayouts = (pendingData || []).map(item => formatPayoutRequest(item));
      const typedApprovedPayouts = (approvedData || []).map(item => formatPayoutRequest(item));
      const typedProcessedPayouts = (processedData || []).map(item => formatPayoutRequest(item));
      
      setPendingPayouts(typedPendingPayouts);
      setApprovedPayouts(typedApprovedPayouts);
      setProcessedPayouts(typedProcessedPayouts);
      
    } catch (err: any) {
      console.error("Error fetching creator earnings:", err);
      setError(err.message || "Failed to load creator earnings data");
      toast({
        title: "Error",
        description: "Failed to load earnings data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, toast]);
  
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);
  
  const processPayouts = async (payoutIds: string[], action: 'approve' | 'process' | 'reject') => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to process payouts",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const now = new Date().toISOString();
      let updates: any = {};
      
      switch (action) {
        case 'approve':
          updates = {
            status: 'approved',
            approved_at: now
          };
          break;
          
        case 'process':
          updates = {
            status: 'processed',
            processed_at: now,
            processed_by: session.user.id
          };
          break;
          
        case 'reject':
          updates = {
            status: 'rejected',
            processed_at: now,
            processed_by: session.user.id
          };
          break;
      }
      
      const { error } = await supabase
        .from('payout_requests')
        .update(updates)
        .in('id', payoutIds);
        
      if (error) throw error;
      
      // Log the action
      await supabase.from('admin_logs').insert({
        admin_id: session.user.id,
        action: action,
        action_type: 'payment',
        details: {
          payout_ids: payoutIds,
          action: action,
          timestamp: now
        }
      });
      
      toast({
        title: "Action Successful",
        description: `Successfully ${action}ed ${payoutIds.length} payout${payoutIds.length > 1 ? 's' : ''}`,
      });
      
      // Refresh data
      fetchAll();
      
    } catch (err: any) {
      console.error(`Error ${action}ing payouts:`, err);
      toast({
        title: "Action Failed",
        description: `Failed to ${action} payouts. ${err.message}`,
        variant: "destructive"
      });
    }
  };
  
  return {
    earnings,
    pendingPayouts,
    approvedPayouts,
    processedPayouts,
    isLoading,
    error,
    fetchAll,
    processPayouts
  };
}
