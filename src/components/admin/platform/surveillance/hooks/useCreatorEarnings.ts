
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

  // Mock data for demo purposes
  const fetchEarnings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real application, you would fetch this from your database
      // For now, we'll use mock data
      const mockEarnings: CreatorEarnings[] = [
        {
          id: '1',
          user_id: 'user-1',
          username: 'bella_star',
          avatar_url: 'https://i.pravatar.cc/150?img=1',
          gross_earnings: 2540.75,
          net_earnings: 2032.60,
          platform_fee: 508.15,
          subscription_count: 145,
          ppv_count: 38,
          tip_count: 67,
          last_payout_date: '2023-11-15T00:00:00Z',
          last_payout_amount: 1500,
          payout_status: 'processed',
          stripe_connected: true,
          source: 'subscription',
          status: 'paid',
          amount: '2540.75',
          description: 'Monthly subscriptions'
        },
        {
          id: '2',
          user_id: 'user-2',
          username: 'jake_cool',
          avatar_url: 'https://i.pravatar.cc/150?img=2',
          gross_earnings: 1125.30,
          net_earnings: 900.24,
          platform_fee: 225.06,
          subscription_count: 78,
          ppv_count: 15,
          tip_count: 23,
          last_payout_date: '2023-11-10T00:00:00Z',
          last_payout_amount: 800,
          payout_status: 'pending',
          stripe_connected: true,
          source: 'ppv',
          status: 'pending',
          amount: '1125.30',
          description: 'Premium videos'
        },
        {
          id: '3',
          user_id: 'user-3',
          username: 'sarah_glam',
          avatar_url: 'https://i.pravatar.cc/150?img=3',
          gross_earnings: 3450.90,
          net_earnings: 2760.72,
          platform_fee: 690.18,
          subscription_count: 210,
          ppv_count: 52,
          tip_count: 98,
          last_payout_date: '2023-11-18T00:00:00Z',
          last_payout_amount: 2500,
          payout_status: 'processed',
          stripe_connected: true,
          source: 'tips',
          status: 'paid',
          amount: '3450.90',
          description: 'Fan tips and gifts'
        },
        {
          id: '4',
          user_id: 'user-4',
          username: 'mike_fitness',
          avatar_url: 'https://i.pravatar.cc/150?img=4',
          gross_earnings: 875.50,
          net_earnings: 700.40,
          platform_fee: 175.10,
          subscription_count: 45,
          ppv_count: 12,
          tip_count: 18,
          last_payout_date: '2023-11-05T00:00:00Z',
          last_payout_amount: 650,
          payout_status: 'declined',
          stripe_connected: false,
          source: 'direct',
          status: 'declined',
          amount: '875.50',
          description: 'Direct content sales'
        },
        {
          id: '5',
          user_id: 'user-5',
          username: 'tanya_travels',
          avatar_url: 'https://i.pravatar.cc/150?img=5',
          gross_earnings: 1890.25,
          net_earnings: 1512.20,
          platform_fee: 378.05,
          subscription_count: 95,
          ppv_count: 28,
          tip_count: 42,
          last_payout_date: '2023-11-12T00:00:00Z',
          last_payout_amount: 1400,
          payout_status: 'pending',
          stripe_connected: true,
          source: 'subscription',
          status: 'pending',
          amount: '1890.25',
          description: 'Monthly subscriptions'
        }
      ];
      
      // Mock data for payout requests
      const mockPayoutRequests: PayoutRequest[] = [
        {
          id: 'payout-1',
          creator_id: 'user-1',
          creator_username: 'bella_star',
          creator_avatar_url: 'https://i.pravatar.cc/150?img=1',
          amount: 2000,
          platform_fee: 400,
          final_amount: 1600,
          requested_at: '2023-11-20T10:30:00Z',
          status: 'pending'
        },
        {
          id: 'payout-2',
          creator_id: 'user-3',
          creator_username: 'sarah_glam',
          creator_avatar_url: 'https://i.pravatar.cc/150?img=3',
          amount: 3000,
          platform_fee: 600,
          final_amount: 2400,
          requested_at: '2023-11-18T14:45:00Z',
          approved_at: '2023-11-19T09:20:00Z',
          status: 'approved'
        },
        {
          id: 'payout-3',
          creator_id: 'user-5',
          creator_username: 'tanya_travels',
          creator_avatar_url: 'https://i.pravatar.cc/150?img=5',
          amount: 1500,
          platform_fee: 300,
          final_amount: 1200,
          requested_at: '2023-11-15T16:10:00Z',
          approved_at: '2023-11-16T11:30:00Z',
          processed_at: '2023-11-17T08:45:00Z',
          status: 'processed'
        }
      ];
      
      setCreatorEarnings(mockEarnings);
      
      // Filter payout requests by status
      setPendingPayouts(mockPayoutRequests.filter(payout => payout.status === 'pending'));
      setProcessingPayouts(mockPayoutRequests.filter(payout => payout.status === 'approved'));
      setCompletedPayouts(mockPayoutRequests.filter(payout => payout.status === 'processed'));
    } catch (err) {
      console.error('Error fetching earnings data:', err);
      setError('Failed to load earnings data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayoutAction = async (payoutId: string, action: 'approve' | 'reject' | 'process') => {
    try {
      // In a real application, you would call your API to update the payout status
      // For now, we'll just update our local state
      
      let updatedPending = [...pendingPayouts];
      let updatedProcessing = [...processingPayouts];
      let updatedCompleted = [...completedPayouts];
      
      if (action === 'approve') {
        // Find the payout in pending
        const payoutIndex = updatedPending.findIndex(p => p.id === payoutId);
        if (payoutIndex >= 0) {
          const payout = { ...updatedPending[payoutIndex] };
          payout.status = 'approved';
          payout.approved_at = new Date().toISOString();
          
          // Remove from pending and add to processing
          updatedPending.splice(payoutIndex, 1);
          updatedProcessing.push(payout);
          
          setPendingPayouts(updatedPending);
          setProcessingPayouts(updatedProcessing);
          
          toast({
            title: "Payout Approved",
            description: `Payout for ${payout.creator_username} has been approved.`
          });
        }
      } else if (action === 'reject') {
        // Find the payout in pending
        const payoutIndex = updatedPending.findIndex(p => p.id === payoutId);
        if (payoutIndex >= 0) {
          const payout = { ...updatedPending[payoutIndex] };
          payout.status = 'rejected';
          
          // Remove from pending
          updatedPending.splice(payoutIndex, 1);
          
          setPendingPayouts(updatedPending);
          
          toast({
            title: "Payout Rejected",
            description: `Payout for ${payout.creator_username} has been rejected.`,
            variant: "destructive"
          });
        }
      } else if (action === 'process') {
        // Find the payout in processing
        const payoutIndex = updatedProcessing.findIndex(p => p.id === payoutId);
        if (payoutIndex >= 0) {
          const payout = { ...updatedProcessing[payoutIndex] };
          payout.status = 'processed';
          payout.processed_at = new Date().toISOString();
          
          // Remove from processing and add to completed
          updatedProcessing.splice(payoutIndex, 1);
          updatedCompleted.push(payout);
          
          setProcessingPayouts(updatedProcessing);
          setCompletedPayouts(updatedCompleted);
          
          toast({
            title: "Payout Processed",
            description: `Payout for ${payout.creator_username} has been processed.`
          });
        }
      }
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
