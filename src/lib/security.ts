
import { supabase } from "@/integrations/supabase/client";

// Screenshot detection
export const initializeScreenshotProtection = (userId: string | undefined, contentOwnerId: string | undefined) => {
  if (typeof document === 'undefined') return;

  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Disable text selection
  document.addEventListener('selectstart', (e) => e.preventDefault());

  // Disable drag and drop
  document.addEventListener('dragstart', (e) => e.preventDefault());

  // Detect keyboard shortcuts for screenshots
  document.addEventListener('keydown', async (e) => {
    const isScreenshotAttempt = (
      (e.key === 'PrintScreen') ||
      (e.ctrlKey && e.key === 'p') ||
      (e.metaKey && e.key === 'p') ||
      (e.ctrlKey && e.shiftKey && e.key === 'p') ||
      (e.metaKey && e.shiftKey && e.key === 'p') ||
      (e.ctrlKey && e.key === 's') ||
      (e.metaKey && e.key === 's')
    );

    if (isScreenshotAttempt) {
      e.preventDefault();
      if (userId && contentOwnerId) {
        await reportSecurityViolation(userId, contentOwnerId, 'screenshot_attempt');
      }
    }
  });

  // Detect clipboard API usage
  document.addEventListener('copy', (e) => {
    e.preventDefault();
  });

  document.addEventListener('paste', (e) => {
    e.preventDefault();
  });

  document.addEventListener('cut', (e) => {
    e.preventDefault();
  });

  // Detect screen capture API
  if (navigator.mediaDevices) {
    navigator.mediaDevices.getDisplayMedia = async () => {
      throw new Error('Screen sharing is disabled for security reasons');
    };
  }

  // Apply CSS to prevent selection
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-touch-callout: none !important;
    }
  `;
  document.head.appendChild(style);
};

// Report security violations
export const reportSecurityViolation = async (
  violatorId: string,
  contentOwnerId: string,
  violationType: 'screenshot_attempt' | 'download_attempt' | 'screen_capture_attempt'
) => {
  try {
    // Log the violation
    const { error: violationError } = await supabase
      .from('security_violations')
      .insert([{
        violator_id: violatorId,
        content_owner_id: contentOwnerId,
        violation_type: violationType
      }]);

    if (violationError) throw violationError;

    // Check violation count for auto-suspension
    const { data: violations, error: countError } = await supabase
      .from('security_violations')
      .select('*')
      .eq('violator_id', violatorId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (countError) throw countError;

    // If more than 3 violations in 30 days, suspend the user
    if (violations && violations.length >= 3) {
      const { error: suspensionError } = await supabase
        .from('profiles')
        .update({ 
          is_suspended: true,
          suspended_at: new Date().toISOString()
        })
        .eq('id', violatorId);

      if (suspensionError) throw suspensionError;

      // Notify the content owner
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([{
          user_id: contentOwnerId,
          type: 'security_violation',
          content: `A user has been suspended for attempting to steal your content`
        }]);

      if (notificationError) throw notificationError;
    }
  } catch (error) {
    console.error('Error reporting security violation:', error);
  }
};

// CSS class to prevent media selection
export const preventMediaSelection = `
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none;
`;
