
import { supabase } from "@/integrations/supabase/client";
import { 
  createUniqueFilePath, 
  runFileDiagnostic, 
  addCacheBuster,
  extractFileExtension,
  getMimeTypeFromExtension
} from "@/utils/upload/fileUtils";
import { validateFileForUpload } from "@/utils/upload/validators";
import { getSupabaseUrl } from "@/utils/media/supabaseUrlUtils";

interface FileUploadOptions {
  contentType?: string;
  upsert?: boolean;
  onProgress?: (progress: number) => void;
}

interface FileUploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload a file to Supabase storage
 * 
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param userId The user ID (for creating paths)
 * @param options Upload options
 * @returns Upload result with URL or error
 */
export const uploadFile = async (
  file: File,
  bucket: string,
  userId: string,
  options?: FileUploadOptions
): Promise<FileUploadResult> => {
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
  
  // CRITICAL: File validation check
  console.log("🧬 FILE DEBUG:", {
    file,
    name: file.name,
    size: `${(file.size / 1024).toFixed(2)} KB`,
    type: file.type,
    lastModified: new Date(file.lastModified).toLocaleString()
  });
  
  try {
    // Use createUniqueFilePath with only the file parameter
    const filePath = createUniqueFilePath(file);
    
    // CRITICAL: Explicitly use the file's type
    const contentType = file.type;
    
    console.log(`📤 Uploading ${file.name} (${contentType}) to ${bucket}/${filePath}`);
    
    // CRITICAL: Upload to Supabase with explicit content type and upsert: true
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: contentType,
        cacheControl: '3600',
        upsert: true  // CRITICAL: Allow overwrites to prevent failed uploads
      });
      
    if (error) {
      console.error("❌ Storage upload error:", error);
      return { 
        success: false, 
        error: error.message || "Upload failed"
      };
    }
    
    if (!data || !data.path) {
      return { 
        success: false, 
        error: "Upload succeeded but no path returned"
      };
    }
    
    console.log("✅ Upload successful, path:", data.path);
    
    // Test upload with getPublicUrl
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    // CRITICAL: Verify and log the result
    if (urlData?.publicUrl) {
      console.log("✅ Supabase URL:", urlData.publicUrl);
    } else {
      console.error("❌ Supabase URL missing");
    }
    
    // Get the URL using our utility function
    const urlResult = await getSupabaseUrl(bucket, data.path, {
      useSignedUrls: false // Use public URLs for most content
    });
    
    if (urlResult.error) {
      console.warn("⚠️ Warning getting URL:", urlResult.error);
    }
    
    if (!urlResult.url) {
      return {
        success: false,
        error: "Failed to get media URL"
      };
    }
    
    // Add cache buster to URL
    const finalUrl = addCacheBuster(urlResult.url);
    
    console.log("📤 Upload successful, URL:", finalUrl);
    
    return {
      success: true,
      url: finalUrl,
      path: data.path
    };
  } catch (error: any) {
    console.error("❌ File upload error:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred"
    };
  }
};

/**
 * Create a local preview URL for a file
 * 
 * @param file File to create preview for
 * @returns Local URL for preview
 */
export const createLocalPreview = (file: File): string => {
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error("Error creating preview URL:", error);
    return "";
  }
};

/**
 * Revoke a local preview URL
 * 
 * @param url URL to revoke
 */
export const revokeLocalPreview = (url: string): void => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};
