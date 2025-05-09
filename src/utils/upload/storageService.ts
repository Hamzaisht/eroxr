import { supabase } from "@/integrations/supabase/client";
import { validateFileForUpload } from "./validators";
import { runFileDiagnostic, logFileDebugInfo } from "./fileUtils";

/**
 * Result of a storage upload operation
 */
export interface UploadResult {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
}

/**
 * Uploads a file to Supabase storage with proper validation
 */
export async function uploadFileToStorage(
  bucket: string,
  path: string,
  file: File
): Promise<UploadResult> {
  try {
    // CRITICAL: Run comprehensive file diagnostic
    runFileDiagnostic(file);
    
    // CRITICAL: Strict file validation before upload
    if (!file || !(file instanceof File) || file.size === 0) {
      console.error("❌ Invalid File passed to uploader", file);
      return {
        success: false,
        error: "Only raw File instances with data can be uploaded"
      };
    }
    
    // Validate file before upload
    const validation = validateFileForUpload(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.message || 'Invalid file'
      };
    }
    
    // Log file debug info
    logFileDebugInfo(file);
    
    // Upload to Supabase storage with proper content type
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: file.type, // CRITICAL: Set correct content type
        upsert: true,           // Allow overwrites
        cacheControl: '3600'    // Cache control header
      });
    
    if (error) {
      console.error("Storage upload error:", error);
      return {
        success: false,
        error: error.message
      };
    }
    
    if (!data || !data.path) {
      return {
        success: false,
        error: 'Upload successful but no path returned'
      };
    }
    
    // Get public URL for verification
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    // CRITICAL: Verify and log the result
    if (urlData?.publicUrl) {
      console.log("✅ Supabase URL:", urlData.publicUrl);
    } else {
      console.error("❌ Supabase URL missing");
    }
    
    // Verify URL is accessible
    try {
      const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
      if (!response.ok) {
        console.warn(`Upload verification failed: ${response.status} ${response.statusText}`);
      } else {
        console.log("Upload verification successful");
      }
    } catch (verifyError) {
      console.warn("Could not verify uploaded file URL:", verifyError);
    }
    
    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl
    };
  } catch (error: any) {
    console.error("Storage upload error:", error);
    return {
      success: false,
      error: error.message || String(error)
    };
  }
}
