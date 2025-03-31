import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number to a more readable format (e.g. 1.2K, 3.4M)
 */
export function formatNumber(num: number = 0): string {
  if (num === 0) return "0";
  
  if (num < 1000) return num.toString();
  
  if (num < 1000000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  
  if (num < 1000000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  
  return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
}
