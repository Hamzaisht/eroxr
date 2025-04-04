
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '$0.00';
  return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function formatPayoutDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getPayoutStatusBadge(status: string): { variant: string; label: string } {
  switch (status) {
    case 'pending':
      return { variant: 'warning', label: 'Pending' };
    case 'approved':
      return { variant: 'info', label: 'Approved' };
    case 'processed':
      return { variant: 'success', label: 'Processed' };
    case 'rejected':
      return { variant: 'destructive', label: 'Rejected' };
    default:
      return { variant: 'secondary', label: status.charAt(0).toUpperCase() + status.slice(1) };
  }
}

export function formatPayoutStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
