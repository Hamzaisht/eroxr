
import { MediaSource, MediaType } from "./types";
import { addCacheBuster, getFileExtension } from "./urlUtils";
import { supabase } from "@/integrations/supabase/client";

/**
 * Create a unique file path for uploading
 * 
 * @param userId User ID for the path
 * @param file File to create path for
 * @returns Unique file path
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  // Create a unique path based on user ID, timestamp, and original filename
  const timestamp = new Date().getTime();
  const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const extension = getFileExtension(filename);
  
  // Format: userId/timestamp_randomString.extension
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${userId}/${timestamp}_${randomString}.${extension}`;
};

/**
 * Upload a file to storage
 * 
 * @param bucket Storage bucket name
 * @param path File path in storage
 * @param file File to upload
 * @returns Upload result with URL or error
 */
export const uploadFileToStorage = async (
  bucket: string,
  path: string,
  file: File
): Promise<{ success: boolean; url?: string; path?: string; error?: string }> => {
  if (!file || !bucket || !path) {
    return { success: false, error: "Invalid upload parameters" };
  }

  try {
    console.log(`Uploading file to ${bucket}/${path}`);

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true
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

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    // Add cache buster
    const publicUrl = addCacheBuster(urlData.publicUrl);

    return {
      success: true,
      url: publicUrl,
      path: data.path
    };
  } catch (error: any) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred"
    };
  }
};

/**
 * Extract media URL from various sources
 */
export const extractMediaUrl = (source: MediaSource | string): string => {
  if (!source) return '';
  
  // Handle string URL directly
  if (typeof source === 'string') {
    return source;
  }
  
  // Extract URL from media source object
  const mediaSource = source as MediaSource;
  
  // Try to extract URL in order of priority
  return (
    mediaSource.video_url ||
    (Array.isArray(mediaSource.video_urls) && mediaSource.video_urls.length > 0 ? mediaSource.video_urls[0] : '') ||
    mediaSource.media_url ||
    (Array.isArray(mediaSource.media_urls) && mediaSource.media_urls.length > 0 ? mediaSource.media_urls[0] : '') ||
    mediaSource.url ||
    mediaSource.src ||
    ''
  );
};

/**
 * Determine media type from source
 */
export const determineMediaType = (source: MediaSource | string): MediaType => {
  if (!source) return MediaType.UNKNOWN;
  
  // Handle string URL directly
  if (typeof source === 'string') {
    const url = source.toLowerCase();
    if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov')) {
      return MediaType.VIDEO;
    }
    if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif') || url.endsWith('.webp')) {
      return MediaType.IMAGE;
    }
    if (url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.ogg')) {
      return MediaType.AUDIO;
    }
    if (url.endsWith('.pdf') || url.endsWith('.doc') || url.endsWith('.docx')) {
      return MediaType.DOCUMENT;
    }
    // Default to unknown for strings we can't determine
    return MediaType.UNKNOWN;
  }
  
  // Extract from media source object
  const mediaSource = source as MediaSource;
  
  // Explicit type
  if (mediaSource.media_type) {
    return mediaSource.media_type as MediaType;
  }
  
  // Infer from properties
  if (mediaSource.video_url || mediaSource.video_urls) {
    return MediaType.VIDEO;
  }
  
  if (mediaSource.media_url || mediaSource.media_urls) {
    // Further determine if it's an image or other media type
    const url = mediaSource.media_url || 
                (Array.isArray(mediaSource.media_urls) && mediaSource.media_urls.length > 0 ? 
                  mediaSource.media_urls[0] : '');
    
    if (url) {
      // Try to determine from URL extension
      return determineMediaType(url);
    }
  }
  
  return MediaType.UNKNOWN;
};
