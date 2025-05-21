import { isValidUrl } from './urlUtils';

/**
 * Determines if a URL is a valid media URL
 * @param url URL to check
 * @returns Boolean indicating if URL is valid
 */
export function isValidMediaUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  return isValidUrl(url);
}

/**
 * Alias for isValidMediaUrl for backward compatibility
 */
export const validateMediaUrl = isValidMediaUrl;

/**
 * Check if a user can access a specific piece of media
 * @param params Access parameters
 * @returns Boolean indicating if user can access media
 */
export function canAccessMedia(params: { 
  creatorId?: string | null; 
  postId?: string | null;
  accessLevel?: string;
  userId?: string | null;
  isPremium?: boolean;
}): boolean {
  // This is just a placeholder function - actual implementation would check
  // if the current user has access to the media based on subscription status,
  // payment status, etc.
  return true;
}
