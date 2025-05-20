
import { formatDistanceToNow, format } from "date-fns";

/**
 * Format message timestamp in a human-readable format
 */
export function formatMessageTime(timestamp: string): string {
  if (!timestamp) return "";
  
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return format(date, "h:mm a");
  } else {
    return formatDistanceToNow(date, { addSuffix: true });
  }
}
