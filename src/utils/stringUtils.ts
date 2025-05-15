
/**
 * Replace all instances of a string with another string
 */
export function replaceAllString(str: string, find: string, replace: string): string {
  return str.split(find).join(replace);
}

/**
 * Format a timestamp to a readable date
 */
export function formatTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleString();
}

/**
 * Truncate a string if it exceeds a certain length
 */
export function truncateString(str: string, maxLength = 100): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

/**
 * Convert camelCase or snake_case to Title Case
 */
export function toTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
}
