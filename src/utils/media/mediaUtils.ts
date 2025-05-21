
import { supabase } from '@/integrations/supabase/client';
import { MediaSource, MediaType } from './types';
import { detectMediaTypeFromUrl } from './mediaTypeUtils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a unique file path for storage based on user ID and file
 */
export const createUniqueFilePath = (userId: string, file: File | string): string => {
  const timestamp = Date.now();
  const uuid = uuidv4().substring(0, 8);
  let fileExt = 'jpg'; // Default extension
  
  if (typeof file === 'object' && file instanceof File) {
    fileExt = file.name.split('.').pop() || 'jpg';
  } else if (typeof file === 'string') {
    // Try to extract extension from string (URL or base64)
    const matches = file.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
    if (matches && matches[1]) {
      fileExt = matches[1];
    }
  }
  
  return `${userId}/${timestamp}-${uuid}.${fileExt}`;
};

/**
 * Uploads a file to Supabase storage and tracks in media_assets
 */
export const uploadFileToStorage = async (
  bucket: string, 
  filePath: string, 
  file: File | string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Handle string file input (data URL)
    let fileToUpload: File | Blob = file as File;
    let originalName = '';
    let fileSize = 0;
    let contentType = 'application/octet-stream';
    
    if (typeof file === 'object' && file instanceof File) {
      originalName = file.name;
      fileSize = file.size;
      contentType = file.type;
    } else if (typeof file === 'string' && file.startsWith('data:')) {
      const res = await fetch(file);
      fileToUpload = await res.blob();
      // Try to extract content type from data URL
      const matches = file.match(/^data:([^;]+);/);
      if (matches && matches[1]) {
        contentType = matches[1];
      }
    } else if (typeof file !== 'object') {
      return { success: false, error: 'Invalid file format' };
    }
    
    // Upload the file with explicit content type
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: true,
        contentType
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    const url = publicUrlData?.publicUrl;
    
    if (!url) {
      return { success: false, error: 'Failed to get public URL' };
    }
    
    // Determine media type from content type
    let mediaType = 'document';
    if (contentType.startsWith('image/')) {
      mediaType = contentType === 'image/gif' ? 'gif' : 'image';
    } else if (contentType.startsWith('video/')) {
      mediaType = 'video';
    } else if (contentType.startsWith('audio/')) {
      mediaType = 'audio';
    }
    
    // Add entry to media_assets table if user is logged in
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    
    if (userId) {
      try {
        const { error: insertError } = await supabase.from('media_assets').insert({
          user_id: userId,
          type: mediaType,
          url,
          original_name: originalName,
          size: fileSize,
          content_type: contentType,
          storage_path: filePath
        });
        
        if (insertError) {
          console.warn('[Metadata Insert Warning]', insertError.message);
        }
      } catch (metadataError) {
        console.error("Failed to save media metadata:", metadataError);
      }
    }

    return { success: true, url };
  } catch (error: any) {
    console.error('Unexpected upload error:', error);
    return { success: false, error: error.message || 'Unknown upload error' };
  }
};

/**
 * Extract media URL from various formats
 */
export const extractMediaUrl = (src: string | MediaSource | any): string => {
  if (typeof src === 'string') {
    return src;
  }
  
  if (src && typeof src === 'object') {
    // Check all the possible URL properties
    if ('url' in src) return src.url;
    if ('media_url' in src) {
      const mediaUrl = src.media_url;
      if (Array.isArray(mediaUrl) && mediaUrl.length > 0) {
        return mediaUrl[0];
      }
      return mediaUrl as string;
    }
    if ('video_url' in src) return src.video_url as string;
  }
  
  return '';
};

/**
 * Normalize media source to ensure consistent format
 */
export const normalizeMediaSource = (source: string | MediaSource | any): MediaSource => {
  if (typeof source === 'string') {
    // Determine media type from URL
    const url = source;
    const type = detectMediaTypeFromUrl(url);
    
    return { url, type };
  }
  
  if (source && typeof source === 'object') {
    if (!('url' in source) && ('media_url' in source || 'video_url' in source)) {
      // Convert alternative URL formats to standard format
      const url = extractMediaUrl(source);
      const type = source.type || detectMediaTypeFromUrl(url);
      
      return {
        ...source,
        url,
        type
      };
    }
    
    // Ensure type is correct MediaType enum
    if (typeof source.type === 'string') {
      let mediaType: MediaType;
      
      switch(source.type.toLowerCase()) {
        case 'image': 
          mediaType = MediaType.IMAGE;
          break;
        case 'video':
          mediaType = MediaType.VIDEO;
          break;
        case 'audio':
          mediaType = MediaType.AUDIO;
          break;
        case 'document':
          mediaType = MediaType.DOCUMENT;
          break;
        case 'gif':
          mediaType = MediaType.GIF;
          break;
        default:
          mediaType = MediaType.UNKNOWN;
      }
      
      return {
        ...source,
        type: mediaType
      };
    }
    
    return source as MediaSource;
  }
  
  // Fallback
  return { url: '', type: MediaType.UNKNOWN };
};

/**
 * Detect media type from URL or content type
 */
export const detectMediaType = (url: string | any): MediaType => {
  // First extract the URL if an object is provided
  const mediaUrl = typeof url === 'string' ? url : extractMediaUrl(url);
  return detectMediaTypeFromUrl(mediaUrl);
};

/**
 * Create a cache-busting URL for media
 */
export const createCacheBustingUrl = (url: string): string => {
  if (!url) return '';
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_cb=${Date.now()}`;
};

/**
 * Convert file size in bytes to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
