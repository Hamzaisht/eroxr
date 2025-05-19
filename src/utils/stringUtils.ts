
/**
 * Replace all occurrences of a substring in a string
 * @param str The string to modify
 * @param find The substring to find
 * @param replace The string to replace with
 * @returns The modified string
 */
export function replaceAllString(str: string, find: string, replace: string): string {
  return str.split(find).join(replace);
}

/**
 * Capitalize the first letter of a string
 * @param str The string to capitalize
 * @returns The capitalized string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format a date string to a readable format
 * @param dateStr The date string to format
 * @returns The formatted date string
 */
export function formatDateString(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

/**
 * Truncate a string to a maximum length
 * @param str The string to truncate
 * @param maxLength The maximum length
 * @returns The truncated string
 */
export function truncate(str: string, maxLength: number): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}
