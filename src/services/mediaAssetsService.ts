
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for managing media assets in the database
 */
export interface MediaAsset {
  id: string;
  user_id: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  original_name?: string;
  size?: number;
  content_type?: string;
  storage_path?: string;
  created_at: string;
}

/**
 * Get all media assets for the current user
 */
export const getUserMediaAssets = async (): Promise<{ 
  data: MediaAsset[] | null; 
  error: Error | null;
}> => {
  const { data, error } = await supabase
    .from('media_assets')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

/**
 * Get media assets by type for the current user
 */
export const getUserMediaByType = async (
  type: 'image' | 'video' | 'audio' | 'document'
): Promise<{ 
  data: MediaAsset[] | null; 
  error: Error | null;
}> => {
  const { data, error } = await supabase
    .from('media_assets')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

/**
 * Delete a media asset
 */
export const deleteMediaAsset = async (
  id: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    // First get the asset to find the storage path
    const { data: asset } = await supabase
      .from('media_assets')
      .select('storage_path')
      .eq('id', id)
      .single();
    
    if (asset?.storage_path) {
      // Determine bucket from storage path
      const pathSegments = asset.storage_path.split('/');
      let bucketName = 'media'; // Default bucket
      
      // Try to infer bucket from path
      if (pathSegments[0] === 'images' || pathSegments[0] === 'videos' || 
          pathSegments[0] === 'audios' || pathSegments[0] === 'documents') {
        bucketName = pathSegments[0];
      }
      
      // Delete from storage
      await supabase.storage
        .from(bucketName)
        .remove([asset.storage_path]);
    }
    
    // Delete from database
    const { error } = await supabase
      .from('media_assets')
      .delete()
      .eq('id', id);
    
    return { success: !error, error };
  } catch (error: any) {
    console.error("Error deleting media asset:", error);
    return { success: false, error };
  }
};

/**
 * Get a single media asset by ID
 */
export const getMediaAssetById = async (
  id: string
): Promise<{ 
  data: MediaAsset | null; 
  error: Error | null;
}> => {
  const { data, error } = await supabase
    .from('media_assets')
    .select('*')
    .eq('id', id)
    .single();
  
  return { data, error };
};

/**
 * Update metadata for a media asset
 */
export const updateMediaAssetMetadata = async (
  id: string, 
  metadata: Partial<Omit<MediaAsset, 'id' | 'user_id' | 'created_at'>>
): Promise<{
  success: boolean;
  error: Error | null;
}> => {
  const { error } = await supabase
    .from('media_assets')
    .update(metadata)
    .eq('id', id);
  
  return { success: !error, error };
};
