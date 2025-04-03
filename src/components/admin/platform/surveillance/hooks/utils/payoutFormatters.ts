
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { PayoutRequest, CreatorEarnings } from '@/types/finance';

// Format payout request status into a Badge component
export const formatPayoutStatus = (status: string) => {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
  
  switch (status) {
    case 'approved':
      variant = 'default';
      break;
    case 'pending':
      variant = 'secondary';
      break;
    case 'rejected':
      variant = 'destructive';
      break;
    default:
      variant = 'outline';
  }
  
  return (
    <Badge variant={variant}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Format amount to currency
export const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date for display
export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  return format(new Date(dateString), 'MMM d, yyyy h:mm a');
};

// Get color class based on amount value
export const getAmountColorClass = (amount: number) => {
  if (amount > 1000) return 'text-green-500';
  if (amount > 500) return 'text-green-400';
  if (amount > 100) return 'text-green-300';
  return 'text-gray-400';
};

// Format creator earnings with icon and styled text
export const formatEarnings = (earnings: CreatorEarnings) => {
  const amountColor = getAmountColorClass(earnings.current_balance);
  
  return (
    <div className="flex flex-col">
      <span className={`font-medium ${amountColor}`}>
        {formatAmount(earnings.current_balance)}
      </span>
      <span className="text-xs text-gray-400">
        {earnings.total_earnings ? `Total: ${formatAmount(earnings.total_earnings)}` : ''}
      </span>
    </div>
  );
};
