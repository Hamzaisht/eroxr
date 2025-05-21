
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { runFileDiagnostic, formatFileSize } from "./fileUtils";

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

/**
 * Centralized file upload utility for Supabase storage
 * Replaces all other upload functions in the app
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
  if (!runFileDiagnostic(file)) {
    return { 
      success: false, 
      error: 'Invalid file object' 
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

/**
 * Create a unique file path for upload
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  const fileExt = file.name.split('.').pop() || '';
  
  // Organize by user ID and file type
  const contentType = file.type.split('/')[0];
  return `${userId}/${contentType}s/${timestamp}-${uniqueId}.${fileExt}`;
};
