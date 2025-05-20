
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types/database.types";

export async function createPost(
  post: Database['public']['Tables']['posts']['Insert'],
  options?: { withMetadata?: boolean },
  errorCallback?: (error: any) => void
) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select('id')
      .single();
      
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating post:', error);
    if (errorCallback) {
      errorCallback(error);
    }
    return { data: null, error };
  }
}
