
import { MediaSource, MediaAccessLevel } from './types';
import { extractMediaUrl } from './mediaUtils';

/**
 * Check if URL is a valid media URL
 * @param url URL to check
 * @returns True if URL is valid
 */
// Rename to 'validateMediaUrl' to avoid conflict with urlUtils.isValidUrl (renamed to isValidMediaUrl in index.ts)
export const validateMediaUrl = (url?: string): boolean => {
  // Basic validation - at minimum should be non-empty
  if (!url) return false;
  
  // Check if absolute URL
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return true;
  }
  
  // Check if relative URL
  if (url.startsWith('/')) {
    return true;
  }
  
  // Check data URLs
  if (url.startsWith('data:')) {
    return true;
  }
  
  return false;
};

// Re-export with the old name for backward compatibility
// Keep this for files that directly import from mediaOrchestrator.ts
export const isValidMediaUrl = validateMediaUrl;

/**
 * Process media source to determine if access is allowed
 * @param source Media source to check
 * @param currentUserData User data to check against
 * @returns Access status and info
 */
export const processMediaAccess = (
  source: MediaSource,
  currentUserData: any
): { canAccess: boolean; reason?: string } => {
  // Default to allowed for public or unspecified access
  if (!source.access_level || source.access_level === MediaAccessLevel.PUBLIC) {
    return { canAccess: true };
  }
  
  // Always allow access to own content
  if (source.creator_id && currentUserData?.id === source.creator_id) {
    return { canAccess: true };
  }
  
  // If no user data provided, access is denied for non-public content
  if (!currentUserData) {
    return { 
      canAccess: false,
      reason: 'authentication-required'
    };
  }
  
  // Check different access levels
  switch (source.access_level) {
    case MediaAccessLevel.FOLLOWERS:
      // Check if current user follows the content creator
      if (!currentUserData?.following?.includes(source.creator_id)) {
        return { 
          canAccess: false, 
          reason: 'followers-only' 
        };
      }
      break;
      
    case MediaAccessLevel.SUBSCRIBERS:
      // Check if current user subscribes to the content creator
      if (!currentUserData?.subscriptions?.includes(source.creator_id)) {
        return { 
          canAccess: false, 
          reason: 'subscribers-only' 
        };
      }
      break;
      
    case MediaAccessLevel.PPV:
      // Check if current user has purchased this specific content
      if (!currentUserData?.purchases?.includes(source.post_id)) {
        return { 
          canAccess: false, 
          reason: 'ppv' 
        };
      }
      break;
      
    case MediaAccessLevel.PRIVATE:
      // Private content is only for the creator (already checked above)
      return { 
        canAccess: false, 
        reason: 'private' 
      };
  }
  
  return { canAccess: true };
};
