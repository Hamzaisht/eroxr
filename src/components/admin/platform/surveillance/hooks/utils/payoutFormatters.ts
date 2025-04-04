
import { CreatorEarnings, PayoutRequest } from "@/types/finance";

/**
 * Format currency amount for display
 * @param amount - The amount to format
 * @param currency - The currency code (default: EUR)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number | null | undefined, currency = 'EUR'): string => {
  if (amount === null || amount === undefined) return '—';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Parse currency string to number
 * @param value - The currency string to parse
 * @returns Parsed number or null if invalid
 */
export const parseCurrencyInput = (value: string): number | null => {
  if (!value) return null;
  
  // Remove any non-numeric characters except decimal point
  const cleanAmount = value.replace(/[^\d.]/g, '');
  
  // Convert to number
  const amount = parseFloat(cleanAmount);
  
  // Return null if NaN
  return isNaN(amount) ? null : amount;
};

/**
 * Format date for display
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '—';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format status for display with appropriate styling
 * @param status - The status string
 * @returns Object with text and style class
 */
export const formatPayoutStatus = (status: string): { text: string; className: string } => {
  switch (status.toLowerCase()) {
    case 'pending':
      return { text: 'Pending', className: 'text-amber-500' };
    case 'approved':
      return { text: 'Approved', className: 'text-blue-500' };
    case 'processed':
      return { text: 'Processed', className: 'text-green-500' };
    case 'rejected':
      return { text: 'Rejected', className: 'text-red-500' };
    default:
      return { text: status, className: 'text-gray-500' };
  }
};
