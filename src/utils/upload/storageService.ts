
import { supabase } from '@/integrations/supabase/client';
import { calculateFileHash, getMediaTypeFromMime } from './fileUtils';

export interface UploadResult {
  success: boolean;
  url?: string;
  assetId?: string;
  error?: string;
}

export interface UploadOptions {
  bucket?: string;
  accessLevel?: 'private' | 'public' | 'subscribers_only';
  category?: string;
  tags?: string[];
  altText?: string;
  metadata?: Record<string, any>;
}

/**
 * Upload file to Supabase storage
 */
export const uploadFileToStorage = async (
  bucket: string,
  path: string,
  file: File
): Promise<UploadResult> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('Unexpected upload error:', error);
    return { success: false, error: error.message || 'Upload failed' };
  }
};

/**
 * Store media asset metadata in database
 */
export const storeMediaAsset = async (
  file: File,
  storagePath: string,
  publicUrl: string,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Calculate content hash for duplicate detection
    const contentHash = await calculateFileHash(file);
    
    // Prepare metadata
    const metadata = {
      ...options.metadata,
      uploadedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      category: options.category
    };

    const { data, error } = await supabase
      .from('media_assets')
      .insert({
        user_id: user.id,
        storage_path: storagePath,
        original_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        media_type: getMediaTypeFromMime(file.type),
        access_level: options.accessLevel || 'private',
        content_hash: contentHash,
        alt_text: options.altText,
        tags: options.tags || [],
        metadata: metadata
      })
      .select('id')
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      url: publicUrl, 
      assetId: data.id 
    };
  } catch (error: any) {
    console.error('Unexpected database error:', error);
    return { success: false, error: error.message || 'Failed to store metadata' };
  }
};

/**
 * Delete media asset and storage file
 */
export const deleteMediaAsset = async (assetId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get asset info first
    const { data: asset, error: fetchError } = await supabase
      .from('media_assets')
      .select('storage_path')
      .eq('id', assetId)
      .single();

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('media')
      .remove([asset.storage_path]);

    if (storageError) {
      console.warn('Storage deletion error:', storageError);
      // Continue with database deletion even if storage fails
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('media_assets')
      .delete()
      .eq('id', assetId);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete asset' };
  }
};

/**
 * Get signed URL for private media
 */
export const getSignedUrl = async (
  storagePath: string, 
  expiresIn: number = 3600
): Promise<{ url?: string; error?: string }> => {
  try {
    const { data, error } = await supabase.storage
      .from('media')
      .createSignedUrl(storagePath, expiresIn);

    if (error) {
      return { error: error.message };
    }

    return { url: data.signedUrl };
  } catch (error: any) {
    return { error: error.message || 'Failed to create signed URL' };
  }
};
