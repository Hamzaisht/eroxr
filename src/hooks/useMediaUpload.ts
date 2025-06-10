
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UploadOptions {
  category?: string;
  accessLevel?: 'private' | 'public' | 'subscribers_only';
  metadata?: Record<string, any>;
}

interface UploadResult {
  success: boolean;
  url?: string;
  assetId?: string;
  error?: string;
}

export const useMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadSingle = async (file: File, options: UploadOptions = {}): Promise<UploadResult> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const { category = 'general', accessLevel = 'public', metadata = {} } = options;
      
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${category}/${user.id}/${fileName}`;

      console.log("MediaUpload - Starting upload:", { fileName, filePath, fileSize: file.size });

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("MediaUpload - Storage upload error:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log("MediaUpload - File uploaded to storage:", uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(uploadData.path);

      console.log("MediaUpload - Generated public URL:", publicUrl);

      // Determine media type
      const mimeType = file.type;
      let mediaType = 'document';
      if (mimeType.startsWith('image/')) mediaType = 'image';
      else if (mimeType.startsWith('video/')) mediaType = 'video';
      else if (mimeType.startsWith('audio/')) mediaType = 'audio';

      // Create media asset record with enhanced metadata
      const assetData = {
        user_id: user.id,
        storage_path: uploadData.path,
        original_name: file.name,
        file_size: file.size,
        mime_type: mimeType,
        media_type: mediaType,
        access_level: accessLevel,
        metadata: {
          ...metadata,
          upload_timestamp: new Date().toISOString(),
          file_extension: fileExt,
          category
        }
      };

      console.log("MediaUpload - Creating asset record:", assetData);

      const { data: assetRecord, error: assetError } = await supabase
        .from('media_assets')
        .insert(assetData)
        .select('id')
        .single();

      if (assetError) {
        console.error("MediaUpload - Asset creation error:", assetError);
        // Clean up uploaded file if asset creation fails
        await supabase.storage.from('media').remove([uploadData.path]);
        throw new Error(`Asset creation failed: ${assetError.message}`);
      }

      console.log("MediaUpload - Asset record created:", assetRecord);

      return {
        success: true,
        url: publicUrl,
        assetId: assetRecord.id
      };

    } catch (error: any) {
      console.error("MediaUpload - Upload failed:", error);
      return {
        success: false,
        error: error.message || 'Upload failed'
      };
    }
  };

  const uploadMultiple = async (files: File[], options: UploadOptions = {}): Promise<UploadResult[]> => {
    setIsUploading(true);
    console.log("MediaUpload - Starting multiple upload:", files.length, "files");

    try {
      const results: UploadResult[] = [];
      
      // Upload files sequentially to avoid overwhelming the server
      for (const file of files) {
        const result = await uploadSingle(file, options);
        results.push(result);
        
        if (!result.success) {
          console.error("MediaUpload - File upload failed:", file.name, result.error);
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failCount = results.length - successCount;

      console.log("MediaUpload - Batch upload completed:", { successCount, failCount });

      if (successCount > 0 && failCount === 0) {
        toast({
          title: "Upload successful",
          description: `${successCount} file(s) uploaded successfully`,
        });
      } else if (successCount > 0 && failCount > 0) {
        toast({
          title: "Partial upload success",
          description: `${successCount} files uploaded, ${failCount} failed`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Upload failed",
          description: "All files failed to upload",
          variant: "destructive",
        });
      }

      return results;

    } catch (error: any) {
      console.error("MediaUpload - Batch upload error:", error);
      toast({
        title: "Upload error",
        description: error.message || "Failed to upload files",
        variant: "destructive",
      });
      
      return files.map(() => ({ success: false, error: error.message }));
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadSingle,
    uploadMultiple,
    isUploading
  };
};
