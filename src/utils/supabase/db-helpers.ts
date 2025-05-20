
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types/database.types";
import { 
  ProfileStatus, 
  safeProfileUpdate 
} from "@/utils/supabase/type-guards";

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileKey = keyof ProfileRow;

/**
 * Update a user's profile status
 * @param userId The ID of the user to update
 * @param status The new status value
 */
export async function updateProfileStatus(userId: string, status: ProfileStatus): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(safeProfileUpdate({ status }))
      .eq('id', userId);
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Failed to update profile status: ${error}`);
    throw error;
  }
}

/**
 * Fetch a user profile by ID
 * @param userId The ID of the user to fetch
 * @returns The user profile or null if not found
 */
export async function fetchUserProfile(userId: string): Promise<ProfileRow | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error || !data) {
      console.error(`Error fetching user profile: ${error || 'No data returned'}`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Exception fetching user profile: ${error}`);
    return null;
  }
}

/**
 * Create a new post for a user
 * @param userId The ID of the user creating the post
 * @param content The post content
 * @param mediaUrls Optional array of media URLs
 * @returns The created post ID or null if creation failed
 */
export async function createPost(
  userId: string, 
  content: string, 
  mediaUrls?: string[], 
  visibility: 'public' | 'subscribers_only' = 'public'
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        creator_id: userId,
        content,
        media_url: mediaUrls,
        visibility
      })
      .select('id')
      .single();
    
    if (error || !data) {
      console.error(`Error creating post: ${error || 'No data returned'}`);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error(`Exception creating post: ${error}`);
    return null;
  }
}

/**
 * Like a post
 * @param userId The ID of the user liking the post
 * @param postId The ID of the post to like
 * @returns boolean indicating success
 */
export async function likePost(userId: string, postId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('post_likes')
      .insert({
        user_id: userId,
        post_id: postId
      });
    
    if (error) {
      console.error(`Error liking post: ${error}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Exception liking post: ${error}`);
    return false;
  }
}

/**
 * Unlike a post
 * @param userId The ID of the user unliking the post
 * @param postId The ID of the post to unlike
 * @returns boolean indicating success
 */
export async function unlikePost(userId: string, postId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);
    
    if (error) {
      console.error(`Error unliking post: ${error}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Exception unliking post: ${error}`);
    return false;
  }
}

/**
 * Delete a post
 * @param postId The ID of the post to delete
 * @param userId The ID of the user who owns the post
 * @returns boolean indicating success
 */
export async function deletePost(postId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('creator_id', userId);
    
    if (error) {
      console.error(`Error deleting post: ${error}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Exception deleting post: ${error}`);
    return false;
  }
}

/**
 * Update a post
 * @param postId The ID of the post to update
 * @param userId The ID of the user who owns the post
 * @param updates Object containing the fields to update
 * @returns boolean indicating success
 */
export async function updatePost(
  postId: string, 
  userId: string,
  updates: { content?: string; visibility?: 'public' | 'subscribers_only' }
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .eq('creator_id', userId);
    
    if (error) {
      console.error(`Error updating post: ${error}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Exception updating post: ${error}`);
    return false;
  }
}

/**
 * Fetch posts for a user's feed
 * @param userId The ID of the current user
 * @param limit Optional limit on number of posts
 * @param offset Optional offset for pagination
 * @returns Array of posts or empty array if error
 */
export async function fetchFeedPosts(
  userId: string, 
  limit: number = 10, 
  offset: number = 0
): Promise<any[]> {
  try {
    // Query for public posts and posts from creators the user is subscribed to
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        creator:creator_id(
          id,
          username,
          avatar_url,
          is_paying_customer
        ),
        likes_count,
        comments_count
      `)
      .or(`visibility.eq.public,creator_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error || !data) {
      console.error(`Error fetching feed posts: ${error || 'No data returned'}`);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error(`Exception fetching feed posts: ${error}`);
    return [];
  }
}
