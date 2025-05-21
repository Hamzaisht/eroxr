
import { supabase } from "@/integrations/supabase/client";
import { runFileDiagnostic, formatFileSize, createUniqueFilePath } from "./fileUtils";

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

/**
 * Centralized file upload utility for Supabase storage
 * @deprecated Use uploadMediaToSupabase from @/utils/media/uploadUtils instead
 */
export const uploadFileToStorage = async (
  bucketName: string = 'media',
  filePath: string,
  file: File
): Promise<UploadResult> => {
  if (!file) {
    return { 
      success: false, 
      error: 'No file provided' 
    };
  }
  
  // Run diagnostic on the file
  const diagnostic = runFileDiagnostic(file);
  if (!diagnostic.valid) {
    return { 
      success: false, 
      error: diagnostic.message || 'Invalid file object' 
    };
  }
  
  try {
    console.log(`Uploading to ${bucketName}/${filePath} (${formatFileSize(file.size)}, type: ${file.type})`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });
    
    if (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: error.message
      };
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    console.log("Upload successful:", publicUrl);
    
    return {
      success: true,
      url: publicUrl,
      path: data.path
    };
  } catch (err: any) {
    console.error("Upload exception:", err);
    return {
      success: false,
      error: err.message
    };
  }
};
