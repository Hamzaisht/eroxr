
import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads a file to Supabase storage
 */
export const uploadFileToStorage = async (
  bucket: string, 
  filePath: string, 
  file: File | string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Handle string file input (data URL)
    let fileToUpload: File | Blob = file as File;
    
    // Convert data URL to blob if needed
    if (typeof file === 'string' && file.startsWith('data:')) {
      const res = await fetch(file);
      fileToUpload = await res.blob();
    } else if (typeof file !== 'object') {
      return { success: false, error: 'Invalid file format' };
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      return { success: false, error: 'Failed to get public URL' };
    }

    // If this is a real File instance and we have a user ID, save metadata
    if (file instanceof File && filePath.includes('/')) {
      const userId = filePath.split('/')[0]; // Try to extract user ID from path
      
      // Only attempt to save metadata if we have what appears to be a UUID
      if (userId && userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        try {
          // Determine media type
          const mimePrefix = file.type.split('/')[0];
          let mediaType;
          
          switch (mimePrefix) {
            case 'image': mediaType = 'image'; break;
            case 'video': mediaType = 'video'; break; 
            case 'audio': mediaType = 'audio'; break;
            default: mediaType = 'document';
          }
          
          // Insert metadata
          await supabase.from('media_assets').insert({
            user_id: userId,
            url: publicUrlData.publicUrl,
            type: mediaType,
            size: file.size,
            original_name: file.name,
            storage_path: filePath,
            content_type: file.type
          });
        } catch (metadataError) {
          // Don't fail the upload if metadata saving fails
          console.error('Error saving media metadata:', metadataError);
        }
      }
    }

    return { success: true, url: publicUrlData.publicUrl };
  } catch (error: any) {
    console.error('Unexpected upload error:', error);
    return { success: false, error: error.message || 'Unknown upload error' };
  }
};
