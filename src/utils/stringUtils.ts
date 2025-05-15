
/**
 * Replace all occurrences of a string
 * @param str Source string
 * @param find String to find
 * @param replace String to replace with
 * @returns New string with all occurrences replaced
 */
export const replaceAllString = (str: string, find: string, replace: string): string => {
  return str.split(find).join(replace);
};

/**
 * Truncate text to a specific length
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated string with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Convert string to title case
 * @param str String to convert
 * @returns Title cased string
 */
export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Create a slug from a string
 * @param text Text to convert to slug
 * @returns URL-friendly slug
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};
