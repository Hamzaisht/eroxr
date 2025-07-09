import { supabase } from '@/integrations/supabase/client';

export type ContentType = 'post' | 'video' | 'dating_ad' | 'profile' | 'story';

interface ViewTrackingOptions {
  contentId: string;
  contentType: ContentType;
  userId?: string;
}

// Generate a device fingerprint for anonymous users
const generateDeviceFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  return btoa(fingerprint).substring(0, 32);
};

// Track a view with anti-manipulation protection
export const trackView = async ({ 
  contentId, 
  contentType, 
  userId 
}: ViewTrackingOptions): Promise<{
  success: boolean;
  tracked: boolean;
  message?: string;
  nextAllowedView?: string;
}> => {
  try {
    console.log('🎯 Tracking view:', { contentId, contentType, userId });

    const deviceFingerprint = generateDeviceFingerprint();
    
    const { data, error } = await supabase.functions.invoke('track-view', {
      body: {
        contentId,
        contentType,
        viewerFingerprint: deviceFingerprint,
        userId
      }
    });

    if (error) {
      console.error('❌ View tracking failed:', error);
      return { success: false, tracked: false, message: error.message };
    }

    console.log('✅ View tracking response:', data);
    return data;
  } catch (error) {
    console.error('❌ View tracking error:', error);
    return { 
      success: false, 
      tracked: false, 
      message: 'Failed to track view' 
    };
  }
};

// Hook for React components to easily track views
export const useViewTracking = () => {
  const trackViewWithCallback = async (
    options: ViewTrackingOptions,
    onSuccess?: () => void,
    onCooldown?: (nextAllowedView: string) => void
  ) => {
    const result = await trackView(options);
    
    if (result.success && result.tracked && onSuccess) {
      onSuccess();
    } else if (result.success && !result.tracked && result.nextAllowedView && onCooldown) {
      onCooldown(result.nextAllowedView);
    }
    
    return result;
  };

  return { trackView: trackViewWithCallback };
};

// Utility to check if content can be viewed (for UI feedback)
export const canTrackView = (lastViewTime?: string): boolean => {
  if (!lastViewTime) return true;
  
  const lastView = new Date(lastViewTime);
  const now = new Date();
  const hoursSinceLastView = (now.getTime() - lastView.getTime()) / (1000 * 60 * 60);
  
  return hoursSinceLastView >= 1;
};

// Get time until next view is allowed
export const getTimeUntilNextView = (lastViewTime: string): string => {
  const lastView = new Date(lastViewTime);
  const nextAllowed = new Date(lastView.getTime() + 60 * 60 * 1000);
  const now = new Date();
  
  if (now >= nextAllowed) return 'Now';
  
  const minutesUntil = Math.ceil((nextAllowed.getTime() - now.getTime()) / (1000 * 60));
  return `${minutesUntil} minute${minutesUntil !== 1 ? 's' : ''}`;
};