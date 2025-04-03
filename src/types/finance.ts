
// Define creator earnings type
export interface CreatorEarnings {
  id: string;
  creator_id: string;
  current_balance: number;
  total_earnings?: number;
  created_at: string;
  updated_at?: string;
  username?: string;
  avatar_url?: string;
  earnings_percentile?: number;
}

// Define payout request type
export interface PayoutRequest {
  id: string;
  creator_id: string;
  amount: number;
  platform_fee?: number;
  final_amount?: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requested_at: string;
  approved_at?: string;
  processed_at?: string;
  processed_by?: string;
  notes?: string;
  username?: string;
  avatar_url?: string;
}

// Define earnings data point for charts
export interface EarningsDataPoint {
  date: string;
  amount: number;
  source?: string;
}

// Define earnings summary
export interface EarningsSummary {
  total: number;
  pending: number;
  processed: number;
  last_period: number;
  growth_percentage: number;
}
