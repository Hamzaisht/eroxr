
export interface CreatorEarnings {
  id: string;
  user_id: string;
  creator_id: string; // Ensure compatibility
  username: string;
  avatar_url?: string;
  total_earnings: number;
  current_balance: number;
  last_payout_date?: string;
  last_payout_amount: number;
  subscriber_count: number;
  tip_count: number;
  ppv_count: number;
  subscription_earnings: number;
  tip_earnings: number;
  ppv_earnings: number;
}

export interface PayoutRequest {
  id: string;
  creator_id: string;
  amount: number;
  platform_fee?: number;
  final_amount?: number;
  requested_at: string;
  approved_at?: string;
  processed_at?: string;
  processed_by?: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed' | 'paid' | 'failed';
  notes?: string;
  username?: string;
  creator_username?: string; // Ensure compatibility
  avatar_url?: string;
}
