
import { supabase } from "@/integrations/supabase/client";

export interface MediaAsset {
  id: string;
  user_id: string;
  storage_path: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  media_type: 'image' | 'video' | 'audio' | 'document';
  access_level: 'private' | 'public' | 'subscribers_only';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UploadResult {
  success: boolean;
  asset?: MediaAsset;
  error?: string;
  url?: string;
}

export class MediaService {
  static async uploadFile(file: File, accessLevel: 'private' | 'public' | 'subscribers_only' = 'private'): Promise<UploadResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Determine media type from MIME type
      const mediaType = this.getMediaType(file.type);
      
      // Generate secure file path
      const { data: pathData, error: pathError } = await supabase.rpc(
        'generate_media_path',
        {
          user_id: user.id,
          media_type: mediaType,
          file_extension: this.getFileExtension(file.name)
        }
      );

      if (pathError || !pathData) {
        return { success: false, error: 'Failed to generate file path' };
      }

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(pathData, file, {
          cacheControl: '3600',
          contentType: file.type
        });

      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      // Create media asset record
      const { data: assetData, error: assetError } = await supabase
        .from('media_assets')
        .insert({
          user_id: user.id,
          storage_path: uploadData.path,
          original_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          media_type: mediaType,
          access_level: accessLevel,
          metadata: {}
        })
        .select()
        .single();

      if (assetError) {
        // Clean up uploaded file if asset creation fails
        await supabase.storage.from('media').remove([uploadData.path]);
        return { success: false, error: assetError.message };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(uploadData.path);

      return {
        success: true,
        asset: assetData,
        url: publicUrl
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async getAsset(id: string): Promise<MediaAsset | null> {
    const { data, error } = await supabase
      .from('media_assets')
      .select('*')
      .eq('id', id)
      .single();

    return error ? null : data;
  }

  static async getUserAssets(userId?: string): Promise<MediaAsset[]> {
    let query = supabase.from('media_assets').select('*');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return error ? [] : data;
  }

  static async deleteAsset(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('media_assets')
      .delete()
      .eq('id', id);

    return !error;
  }

  static async updateAccessLevel(id: string, accessLevel: 'private' | 'public' | 'subscribers_only'): Promise<boolean> {
    const { error } = await supabase
      .from('media_assets')
      .update({ access_level: accessLevel })
      .eq('id', id);

    return !error;
  }

  static getPublicUrl(storagePath: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(storagePath);
    
    return publicUrl;
  }

  private static getMediaType(mimeType: string): 'image' | 'video' | 'audio' | 'document' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  }

  private static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || 'bin';
  }
}
