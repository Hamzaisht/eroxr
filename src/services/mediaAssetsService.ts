
import { supabase } from '@/integrations/supabase/client';

export interface MediaAsset {
  id: string;
  user_id: string;
  storage_path: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  media_type: 'image' | 'video' | 'audio' | 'document';
  access_level: 'private' | 'public' | 'subscribers_only';
  moderation_status: 'pending' | 'approved' | 'rejected' | 'flagged';
  view_count: number;
  download_count: number;
  content_hash?: string;
  alt_text?: string;
  tags: string[];
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Get user's media assets
 */
export const getUserMediaAssets = async (): Promise<{
  data: MediaAsset[] | null;
  error: any;
}> => {
  try {
    const { data, error } = await supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error: any) {
    return { data: null, error };
  }
};

/**
 * Get media assets by type
 */
export const getUserMediaByType = async (
  type: 'image' | 'video' | 'audio' | 'document'
): Promise<{
  data: MediaAsset[] | null;
  error: any;
}> => {
  try {
    const { data, error } = await supabase
      .from('media_assets')
      .select('*')
      .eq('media_type', type)
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error: any) {
    return { data: null, error };
  }
};

/**
 * Get single media asset
 */
export const getMediaAsset = async (id: string): Promise<{
  data: MediaAsset | null;
  error: any;
}> => {
  try {
    const { data, error } = await supabase
      .from('media_assets')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  } catch (error: any) {
    return { data: null, error };
  }
};

/**
 * Update media asset
 */
export const updateMediaAsset = async (
  id: string,
  updates: Partial<MediaAsset>
): Promise<{
  data: MediaAsset | null;
  error: any;
}> => {
  try {
    const { data, error } = await supabase
      .from('media_assets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  } catch (error: any) {
    return { data: null, error };
  }
};

/**
 * Delete media asset
 */
export const deleteMediaAsset = async (id: string): Promise<{
  success: boolean;
  error?: any;
}> => {
  try {
    // Get storage path first
    const { data: asset } = await supabase
      .from('media_assets')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (asset) {
      // Delete from storage
      await supabase.storage
        .from('media')
        .remove([asset.storage_path]);
    }

    // Delete from database
    const { error } = await supabase
      .from('media_assets')
      .delete()
      .eq('id', id);

    return { success: !error, error };
  } catch (error: any) {
    return { success: false, error };
  }
};

/**
 * Increment view/download counter
 */
export const incrementCounter = async (
  assetId: string,
  counterType: 'view' | 'download'
): Promise<void> => {
  try {
    await supabase.rpc('increment_media_counter', {
      asset_id: assetId,
      counter_type: counterType
    });
  } catch (error) {
    console.error('Failed to increment counter:', error);
  }
};

/**
 * Search media assets
 */
export const searchMediaAssets = async (
  query: string,
  filters?: {
    mediaType?: string;
    accessLevel?: string;
    tags?: string[];
  }
): Promise<{
  data: MediaAsset[] | null;
  error: any;
}> => {
  try {
    let queryBuilder = supabase
      .from('media_assets')
      .select('*');

    // Text search in name and alt text
    if (query) {
      queryBuilder = queryBuilder.or(
        `original_name.ilike.%${query}%,alt_text.ilike.%${query}%`
      );
    }

    // Apply filters
    if (filters?.mediaType) {
      queryBuilder = queryBuilder.eq('media_type', filters.mediaType);
    }

    if (filters?.accessLevel) {
      queryBuilder = queryBuilder.eq('access_level', filters.accessLevel);
    }

    if (filters?.tags && filters.tags.length > 0) {
      queryBuilder = queryBuilder.overlaps('tags', filters.tags);
    }

    const { data, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .limit(50);

    return { data, error };
  } catch (error: any) {
    return { data: null, error };
  }
};
