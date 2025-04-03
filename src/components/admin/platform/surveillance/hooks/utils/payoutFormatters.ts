
import { CreatorEarnings, PayoutRequest } from "../../types";
import { WithProfile } from "@/integrations/supabase/types/profile";

// Helper function to determine earning source based on data
export const determineEarningSource = (earning: any): string => {
  const description = earning.notes?.toLowerCase() || '';
  if (description.includes('subscription')) return 'subscription';
  if (description.includes('ppv') || description.includes('premium')) return 'ppv';
  if (description.includes('tip') || description.includes('gift')) return 'tips';
  if (description.includes('direct') || description.includes('sale')) return 'direct';
  return 'subscription'; // Default
};

// Helper function to determine description if not provided
export const determineEarningDescription = (earning: any): string => {
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
export const formatPayoutRequest = (payout: WithProfile<any>): PayoutRequest => {
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

// Function to process earnings data into CreatorEarnings format
export const processEarningsData = (earnings: WithProfile<any>[]): CreatorEarnings[] => {
  return earnings.map(earning => {
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
};
