
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Track media actions like screenshots for trending content
 */
export async function trackMediaAction(
  postId: string,
  actionType: 'screenshot' | 'download' | 'share'
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Insert media action - database triggers will handle trending_content updates
    const { error } = await supabase
      .from('post_media_actions')
      .insert({
        post_id: postId,
        user_id: user.id,
        action_type: actionType
      });

    if (error) {
      console.error('Error tracking media action:', error);
      return;
    }

    // Database triggers automatically:
    // - Update trending_content.screenshots (if actionType is 'screenshot')
    // - Recalculate trending score
    // - Maintain data consistency

    console.log(`Media action '${actionType}' tracked for post:`, postId);
  } catch (error) {
    console.error('Failed to track media action:', error);
  }
}

/**
 * Track screenshot action specifically
 */
export const trackScreenshot = (postId: string) => trackMediaAction(postId, 'screenshot');

/**
 * Track download action
 */
export const trackDownload = (postId: string) => trackMediaAction(postId, 'download');

/**
 * Track share action
 */
export const trackShare = (postId: string) => trackMediaAction(postId, 'share');
