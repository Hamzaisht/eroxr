import { supabase } from "@/integrations/supabase/client";

export interface MediaUploadResult {
  success: boolean;
  url?: string;
  assetId?: string;
  error?: string;
}

export interface MediaAssetData {
  id: string;
  storage_path: string;
  media_type: 'image' | 'video';
  mime_type: string;
  original_name: string;
  file_size: number;
  access_level: 'public' | 'private';
  alt_text?: string;
}

export class MediaUploadService {
  /**
   * Upload a single file to Supabase storage and create a media asset record
   */
  static async uploadFile(file: File, userId: string): Promise<MediaUploadResult> {
    try {
      // Validate file
      if (!file || !userId) {
        return { success: false, error: "File and user ID are required" };
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}_${randomString}.${fileExt}`;
      const storagePath = `general/${userId}/${fileName}`;

      console.log("MediaUploadService - Starting upload:", {
        fileName,
        storagePath,
        fileSize: file.size,
        fileType: file.type
      });

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('general')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("MediaUploadService - Storage upload failed:", uploadError);
        return { success: false, error: `Upload failed: ${uploadError.message}` };
      }

      console.log("MediaUploadService - File uploaded to storage:", uploadData);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('general')
        .getPublicUrl(storagePath);

      if (!publicUrlData?.publicUrl) {
        return { success: false, error: "Failed to get public URL" };
      }

      // Determine media type
      const mediaType = file.type.startsWith('video/') ? 'video' : 'image';

      // Create media asset record in database
      const { data: assetData, error: assetError } = await supabase
        .from('media_assets')
        .insert({
          user_id: userId,
          storage_path: storagePath,
          media_type: mediaType,
          mime_type: file.type,
          original_name: file.name,
          file_size: file.size,
          access_level: 'public'
        })
        .select()
        .single();

      if (assetError) {
        console.error("MediaUploadService - Database insert failed:", assetError);
        
        // Clean up storage file if database insert fails
        await supabase.storage.from('general').remove([storagePath]);
        
        return { success: false, error: `Database error: ${assetError.message}` };
      }

      console.log("MediaUploadService - Asset record created:", assetData);

      return {
        success: true,
        url: publicUrlData.publicUrl,
        assetId: assetData.id
      };

    } catch (error: any) {
      console.error("MediaUploadService - Unexpected error:", error);
      return { success: false, error: error.message || "Unexpected error occurred" };
    }
  }

  /**
   * Upload multiple files and return their asset IDs
   */
  static async uploadFiles(files: File[], userId: string): Promise<{
    success: boolean;
    results: MediaUploadResult[];
    assetIds: string[];
    urls: string[];
    error?: string;
  }> {
    try {
      console.log("MediaUploadService - Starting batch upload:", {
        fileCount: files.length,
        userId
      });

      const uploadPromises = files.map(file => this.uploadFile(file, userId));
      const results = await Promise.all(uploadPromises);

      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (failed.length > 0) {
        console.warn("MediaUploadService - Some uploads failed:", failed);
      }

      const assetIds = successful.map(r => r.assetId!);
      const urls = successful.map(r => r.url!);

      console.log("MediaUploadService - Batch upload completed:", {
        successful: successful.length,
        failed: failed.length,
        assetIds
      });

      return {
        success: successful.length > 0,
        results,
        assetIds,
        urls,
        error: failed.length > 0 ? `${failed.length} uploads failed` : undefined
      };

    } catch (error: any) {
      console.error("MediaUploadService - Batch upload error:", error);
      return {
        success: false,
        results: [],
        assetIds: [],
        urls: [],
        error: error.message || "Batch upload failed"
      };
    }
  }

  /**
   * Delete a media asset and its storage file
   */
  static async deleteAsset(assetId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get asset details
      const { data: asset, error: fetchError } = await supabase
        .from('media_assets')
        .select('storage_path, user_id')
        .eq('id', assetId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !asset) {
        return { success: false, error: "Asset not found or unauthorized" };
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('general')
        .remove([asset.storage_path]);

      if (storageError) {
        console.warn("MediaUploadService - Storage deletion failed:", storageError);
        // Continue with database deletion even if storage fails
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', assetId)
        .eq('user_id', userId);

      if (dbError) {
        return { success: false, error: `Database deletion failed: ${dbError.message}` };
      }

      console.log("MediaUploadService - Asset deleted:", assetId);
      return { success: true };

    } catch (error: any) {
      console.error("MediaUploadService - Delete error:", error);
      return { success: false, error: error.message || "Delete failed" };
    }
  }
}