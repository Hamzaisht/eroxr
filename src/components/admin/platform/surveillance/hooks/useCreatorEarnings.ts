
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { CreatorEarnings, PayoutRequest } from '../types';

export const useCreatorEarnings = () => {
  const [earnings, setEarnings] = useState<CreatorEarnings[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<PayoutRequest[]>([]);
  const [approvedPayouts, setApprovedPayouts] = useState<PayoutRequest[]>([]);
  const [processedPayouts, setProcessedPayouts] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const fetchEarnings = async () => {
    try {
      // In a real implementation, this would fetch from a database
      // For now, we'll use mock data
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .limit(20);

      if (error) throw error;

      // Transform profiles to earnings data
      const mockEarnings: CreatorEarnings[] = data.map(profile => ({
        creator_id: profile.id,
        username: profile.username || 'Unknown',
        avatar_url: profile.avatar_url || '',
        total_earnings: Math.random() * 10000,
        subscription_earnings: Math.random() * 5000,
        tip_earnings: Math.random() * 3000,
        ppv_earnings: Math.random() * 2000,
        last_payout_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        last_payout_amount: Math.random() * 2000,
      }));

      setEarnings(mockEarnings);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch creator earnings',
        variant: 'destructive',
      });
    }
  };

  const fetchPendingPayouts = async () => {
    try {
      // In a real implementation, this would fetch from a database
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*, profiles(username)')
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });

      if (error) throw error;

      // Transform to PayoutRequest[] with username
      const payouts: PayoutRequest[] = data.map(payout => ({
        ...payout,
        creator_username: payout.profiles?.username || 'Unknown',
      }));

      setPendingPayouts(payouts);
    } catch (error) {
      console.error('Error fetching pending payouts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pending payouts',
        variant: 'destructive',
      });
    }
  };

  const fetchApprovedPayouts = async () => {
    try {
      // Similar to above but for approved payouts
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*, profiles(username)')
        .eq('status', 'approved')
        .order('approved_at', { ascending: false });

      if (error) throw error;

      const payouts: PayoutRequest[] = data.map(payout => ({
        ...payout,
        creator_username: payout.profiles?.username || 'Unknown',
      }));

      setApprovedPayouts(payouts);
    } catch (error) {
      console.error('Error fetching approved payouts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch approved payouts',
        variant: 'destructive',
      });
    }
  };

  const fetchProcessedPayouts = async () => {
    try {
      // Similar to above but for processed payouts
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*, profiles(username)')
        .eq('status', 'processed')
        .order('processed_at', { ascending: false });

      if (error) throw error;

      const payouts: PayoutRequest[] = data.map(payout => ({
        ...payout,
        creator_username: payout.profiles?.username || 'Unknown',
      }));

      setProcessedPayouts(payouts);
    } catch (error) {
      console.error('Error fetching processed payouts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch processed payouts',
        variant: 'destructive',
      });
    }
  };

  const fetchAll = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchEarnings(),
      fetchPendingPayouts(),
      fetchApprovedPayouts(),
      fetchProcessedPayouts()
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const processPayouts = async (payoutIds: string[]) => {
    try {
      const { error } = await supabase
        .from('payout_requests')
        .update({ 
          status: 'processed',
          processed_at: new Date().toISOString(),
        })
        .in('id', payoutIds);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${payoutIds.length} payout(s) processed successfully`,
      });

      // Refresh the data
      await fetchAll();
    } catch (error) {
      console.error('Error processing payouts:', error);
      toast({
        title: 'Error',
        description: 'Failed to process payouts',
        variant: 'destructive',
      });
    }
  };

  return {
    earnings,
    pendingPayouts,
    approvedPayouts,
    processedPayouts,
    isLoading,
    fetchAll,
    processPayouts
  };
};
