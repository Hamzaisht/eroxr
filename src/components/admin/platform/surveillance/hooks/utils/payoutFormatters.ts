import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { PayoutRequest, CreatorEarnings } from "../../types";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatPayoutDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy');
};

export const getPayoutStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        variant: 'secondary',
      };
    case 'approved':
      return {
        label: 'Approved',
        variant: 'outline',
      };
    case 'processed':
      return {
        label: 'Processed',
        variant: 'default',
      };
    case 'rejected':
      return {
        label: 'Rejected',
        variant: 'destructive',
      };
    default:
      return {
        label: 'Unknown',
        variant: 'default',
      };
  }
};
