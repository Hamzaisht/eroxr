
import { format } from 'date-fns';
import { CreatorEarnings, PayoutRequest } from "../../types";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatEarningsAmount = (amount: number): string => {
  return formatCurrency(amount);
};

export const formatPayoutDate = (date: string | null | undefined): string => {
  if (!date) return 'Not processed';
  return format(new Date(date), 'MMM d, yyyy');
};

export const getPayoutStatusBadge = (status: string): { variant: string, label: string } => {
  switch(status.toLowerCase()) {
    case 'pending':
      return { variant: 'warning', label: 'Pending' };
    case 'approved':
      return { variant: 'secondary', label: 'Approved' };
    case 'processed':
      return { variant: 'success', label: 'Processed' };
    case 'rejected':
      return { variant: 'destructive', label: 'Rejected' };
    default:
      return { variant: 'outline', label: status };
  }
};

export const formatPayoutRequest = (req: any): PayoutRequest => {
  return {
    id: req.id,
    creator_id: req.creator_id,
    amount: parseFloat(req.amount) || 0,
    platform_fee: parseFloat(req.platform_fee) || 0,
    final_amount: parseFloat(req.final_amount) || 0,
    requested_at: req.requested_at,
    approved_at: req.approved_at,
    processed_at: req.processed_at,
    processed_by: req.processed_by,
    status: req.status || 'pending',
    notes: req.notes,
    creator_username: req.creator_username || 'Unknown'
  };
};

export const processEarningsData = (data: any[]): CreatorEarnings[] => {
  return data.map(item => ({
    id: item.id,
    creator_id: item.user_id,
    user_id: item.user_id,
    username: item.username || 'Unknown',
    avatar_url: item.avatar_url,
    total_earnings: parseFloat(item.gross_earnings) || 0,
    this_month: parseFloat(item.current_month_earnings) || 0,
    pending_earnings: parseFloat(item.pending_earnings) || 0,
    available_for_payout: parseFloat(item.available_for_payout) || 0,
    fan_count: parseInt(item.fan_count) || 0,
    subscription_earnings: parseFloat(item.subscription_earnings) || 0,
    ppv_earnings: parseFloat(item.ppv_earnings) || 0,
    tip_earnings: parseFloat(item.tip_earnings) || 0,
    subscription_count: parseInt(item.subscription_count) || 0,
    ppv_count: parseInt(item.ppv_count) || 0,
    tip_count: parseInt(item.tip_count) || 0,
    source: item.source,
    status: item.status,
    description: item.description,
    amount: parseFloat(item.amount) || 0,
    created_at: item.created_at
  }));
};
