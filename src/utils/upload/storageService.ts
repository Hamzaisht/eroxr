
import { supabase } from "@/integrations/supabase/client";
import { createUniqueFilePath } from "./fileUtils";
import { addCacheBuster } from "./fileUtils";

interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload a file to Supabase storage with improved error handling and consistent path generation
 * 
 * @param bucket The storage bucket name
 * @param path The path to store the file under
 * @param file The file to upload
 * @returns Upload result with URL and path if successful
 */
export const uploadFileToStorage = async (
  bucket: string,
  path: string,
  file: File
): Promise<UploadResult> => {
  if (!file || !(file instanceof File)) {
    console.error("Invalid file provided to uploadFileToStorage");
    return { success: false, error: "Invalid file provided" };
  }

  console.log(`Uploading file to ${bucket}/${path}`);

  try {
    // Upload to Supabase storage with explicit content type
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'application/octet-stream'
      });

    if (error) {
      console.error("Storage upload error:", error);
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

    // Get public URL using the consistent method
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    if (!urlData || !urlData.publicUrl) {
      return {
        success: false,
        error: "Failed to get media URL"
      };
    }

    // Add cache buster to ensure fresh content
    const finalUrl = addCacheBuster(urlData.publicUrl);

    console.log("Upload successful, URL:", finalUrl);

    return {
      success: true,
      url: finalUrl,
      path: data.path
    };
  } catch (error: any) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred during upload"
    };
  }
};

/**
 * Get the public URL for a file in storage
 * 
 * @param bucket The storage bucket name
 * @param path The path of the file
 * @returns The public URL with cache buster
 */
export const getStorageFileUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl ? addCacheBuster(data.publicUrl) : '';
};
