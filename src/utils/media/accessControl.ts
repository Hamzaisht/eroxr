import { MediaAccessLevel } from './types';

export interface AccessCheckResult {
  canAccess: boolean;
  reason?: 'subscription' | 'purchase' | 'follow' | 'login' | 'private';
  actionText?: string;
  actionUrl?: string;
}

export const getAccessDeniedReason = (
  accessLevel: MediaAccessLevel,
  isLoggedIn: boolean,
  isOwner: boolean,
  isSubscriber: boolean,
  hasPurchased: boolean,
  isFollower: boolean
): AccessCheckResult => {
  // Owner and admins can always access
  if (isOwner) {
    return { canAccess: true };
  }

  // Public content is always accessible
  if (accessLevel === MediaAccessLevel.PUBLIC) {
    return { canAccess: true };
  }

  // Not logged in users can't access restricted content
  if (!isLoggedIn) {
    return {
      canAccess: false,
      reason: 'login',
      actionText: 'Log in to view',
      actionUrl: '/auth'
    };
  }

  // Check specific access levels
  switch (accessLevel) {
    case MediaAccessLevel.SUBSCRIBERS:
      if (!isSubscriber) {
        return {
          canAccess: false,
          reason: 'subscription',
          actionText: 'Subscribe to view',
          actionUrl: '/subscription'
        };
      }
      break;

    case MediaAccessLevel.PPV:
      if (!hasPurchased) {
        return {
          canAccess: false,
          reason: 'purchase',
          actionText: 'Purchase to view'
        };
      }
      break;

    case MediaAccessLevel.FOLLOWERS:
      if (!isFollower) {
        return {
          canAccess: false,
          reason: 'follow',
          actionText: 'Follow to view'
        };
      }
      break;

    case MediaAccessLevel.PRIVATE:
      return {
        canAccess: false,
        reason: 'private',
        actionText: 'Private content'
      };

    default:
      return { canAccess: true };
  }

  return { canAccess: true };
};

export const shouldBlurMedia = (accessLevel: MediaAccessLevel, canAccess: boolean): boolean => {
  if (canAccess) return false;
  
  // Blur content for restricted access
  return accessLevel !== MediaAccessLevel.PUBLIC;
};

export const getPreviewDuration = (accessLevel: MediaAccessLevel): number => {
  // PPV content gets a 10-second preview
  if (accessLevel === MediaAccessLevel.PPV) return 10;
  
  // Other restricted content gets no preview
  return 0;
};
