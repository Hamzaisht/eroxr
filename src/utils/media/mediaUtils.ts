import { MediaType, MediaSource, StorageUploadResult } from './types';
import { supabase } from '@/integrations/supabase/client';
import { getFileExtension, isImageUrl, isVideoUrl, isAudioUrl } from './mediaUrlUtils';
import { compressImage } from './imageCompression';

/**
 * Determines the media type (image, video, etc.) from various input formats
 * @param fileOrUrl - The file, URL, or media source object
 * @returns The determined MediaType
 */
export function determineMediaType(fileOrUrl: string | MediaSource | File | null | undefined): MediaType {
  // If null or undefined, return unknown
  if (fileOrUrl == null) {
    return MediaType.UNKNOWN;
  }

  // If it's a File object
  if (fileOrUrl instanceof File) {
    const fileType = fileOrUrl.type;
    if (fileType.startsWith('image/')) {
      return MediaType.IMAGE;
    } else if (fileType.startsWith('video/')) {
      return MediaType.VIDEO;
    } else if (fileType.startsWith('audio/')) {
      return MediaType.AUDIO;
    }
    return MediaType.FILE;
  }

  // If it's a string URL
  if (typeof fileOrUrl === 'string') {
    if (isImageUrl(fileOrUrl)) {
      return MediaType.IMAGE;
    } else if (isVideoUrl(fileOrUrl)) {
      return MediaType.VIDEO;
    } else if (isAudioUrl(fileOrUrl)) {
      return MediaType.AUDIO;
    }
    return MediaType.FILE;
  }

  // If it's a MediaSource object
  if (typeof fileOrUrl === 'object') {
    // Direct media_type prop takes precedence
    if (fileOrUrl.media_type) {
      const mediaType = typeof fileOrUrl.media_type === 'string'
        ? fileOrUrl.media_type.toLowerCase()
        : fileOrUrl.media_type;
      
      if (mediaType === MediaType.IMAGE || mediaType === 'image') {
        return MediaType.IMAGE;
      } else if (mediaType === MediaType.VIDEO || mediaType === 'video') {
        return MediaType.VIDEO;
      } else if (mediaType === MediaType.AUDIO || mediaType === 'audio') {
        return MediaType.AUDIO;
      }
    }
    
    // Check various URL properties
    const videoUrl = fileOrUrl.video_url || (fileOrUrl.video_urls && fileOrUrl.video_urls.length > 0 && fileOrUrl.video_urls[0]);
    if (videoUrl) return MediaType.VIDEO;
    
    const mediaUrl = fileOrUrl.media_url || (fileOrUrl.media_urls && fileOrUrl.media_urls.length > 0 && fileOrUrl.media_urls[0]) || fileOrUrl.url || fileOrUrl.src;
    if (mediaUrl) {
      if (isImageUrl(mediaUrl)) return MediaType.IMAGE;
      if (isVideoUrl(mediaUrl)) return MediaType.VIDEO;
      if (isAudioUrl(mediaUrl)) return MediaType.AUDIO;
    }
    
    // Check for thumbnail/poster as a hint that it might be video
    if (fileOrUrl.thumbnail_url || fileOrUrl.video_thumbnail_url || fileOrUrl.poster) {
      return MediaType.VIDEO;
    }
  }
  
  return MediaType.UNKNOWN;
}

/**
 * Extracts a media URL from various input formats
 * @param source - The source containing the URL
 * @returns The extracted URL or null if not found
 */
export function extractMediaUrl(source: string | MediaSource | null | undefined): string | null {
  if (!source) return null;

  // If it's already a string URL
  if (typeof source === 'string') {
    return source;
  }

  // If it's a MediaSource object, try to extract from various properties
  if (typeof source === 'object') {
    // Try all possible URL fields
    return source.media_url 
        || source.url 
        || source.src 
        || (source.media_urls && source.media_urls.length > 0 && source.media_urls[0]) 
        || source.video_url 
        || (source.video_urls && source.video_urls.length > 0 && source.video_urls[0]) 
        || null;
  }

  return null;
}

/**
 * Creates a unique file path for storage
 * @param userId - User ID for path prefixing
 * @param file - File to upload (used for extension)
 * @returns Unique storage path
 */
export function createUniqueFilePath(userId: string, file: File | string): string {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 10);
  
  let fileExtension = '';
  
  if (typeof file === 'string') {
    // If file is a string URL, get extension from URL
    fileExtension = getFileExtension(file) || 'unknown';
  } else {
    // If file is a File object, get extension from name
    const parts = file.name.split('.');
    fileExtension = parts.length > 1 ? parts.pop() || 'unknown' : 'unknown';
  }
  
  return `${userId}/${timestamp}-${random}.${fileExtension}`;
}

/**
 * Upload a file to storage, handling both File objects and string URLs
 * @param bucket - Storage bucket name
 * @param path - Path for storage
 * @param fileOrUrl - File object or string URL to upload
 * @returns Result object with success, url and error
 */
export async function uploadFileToStorage(bucket: string, path: string, fileOrUrl: File | string): Promise<StorageUploadResult> {
  try {
    let file: File;
    
    // If fileOrUrl is a string, fetch it and create a File object
    if (typeof fileOrUrl === 'string') {
      try {
        const response = await fetch(fileOrUrl);
        const blob = await response.blob();
        const fileName = fileOrUrl.split('/').pop() || 'file';
        file = new File([blob], fileName, { type: blob.type });
      } catch (err) {
        console.error('Error converting URL to file:', err);
        return {
          path: '',
          url: '',
          success: false,
          error: `Failed to process URL: ${err instanceof Error ? err.message : String(err)}`
        };
      }
    } else {
      file = fileOrUrl;
    }

    // Upload the file to storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (uploadError) {
      return {
        path: '',
        url: '',
        success: false,
        error: uploadError.message
      };
    }

    // Get the public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return {
      path,
      url: data.publicUrl,
      success: true,
      error: null
    };
  } catch (err) {
    return {
      path: '',
      url: '',
      success: false,
      error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}`
    };
  }
}

/**
 * Optimizes an image for upload by resizing and compressing it
 * @param file - The image file to optimize
 * @param options - Options for optimization (maxWidth, maxHeight, quality)
 * @returns A Promise that resolves to the optimized image as a File
 */
export async function optimizeImage(
  file: File,
  options = { maxWidth: 1920, maxHeight: 1920, quality: 0.85 }
): Promise<File> {
  try {
    // If file is not an image, return it as-is
    if (!file.type.startsWith('image/')) {
      console.log('Not optimizing non-image file:', file.type);
      return file;
    }

    // If file is small enough, return it as-is
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB <= 1) {
      console.log('Not optimizing already small image:', fileSizeInMB.toFixed(2) + 'MB');
      return file;
    }

    // Compress the image using our compression utility
    console.log('Optimizing image:', file.name, fileSizeInMB.toFixed(2) + 'MB');
    const compressedBlob = await compressImage(file, options);
    
    // Create a new File from the compressed blob
    const optimizedFile = new File([compressedBlob], file.name, {
      type: 'image/jpeg', // Convert all images to JPEG for consistency
      lastModified: Date.now()
    });
    
    console.log('Image optimized:', optimizedFile.size / (1024 * 1024) + 'MB');
    return optimizedFile;
  } catch (err) {
    console.warn('Image optimization failed, using original file:', err);
    return file;
  }
}

/**
 * Creates a thumbnail from a video file
 * @param videoFile - The video file to create thumbnail from
 * @param maxSize - Maximum thumbnail dimension
 * @returns A Promise that resolves to the thumbnail as a Blob
 */
export async function createVideoThumbnail(
  videoFile: File,
  maxSize = 480
): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      // Create video element to capture frame
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      // Create a blob URL for the video
      const videoUrl = URL.createObjectURL(videoFile);
      
      video.onloadedmetadata = () => {
        // Seek to 1/3 through the video for a representative frame
        video.currentTime = video.duration / 3;
      };
      
      video.oncanplay = () => {
        // Create a canvas to draw the thumbnail
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.error('Failed to get 2D context for thumbnail creation');
          URL.revokeObjectURL(videoUrl);
          resolve(null);
          return;
        }
        
        // Calculate dimensions maintaining aspect ratio
        let width = video.videoWidth;
        let height = video.videoHeight;
        
        if (width > height) {
          if (width > maxSize) {
            height = height * (maxSize / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = width * (maxSize / height);
            height = maxSize;
          }
        }
        
        // Set canvas size and draw video frame
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(video, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(videoUrl);
            resolve(blob);
          },
          'image/jpeg',
          0.85
        );
      };
      
      video.onerror = () => {
        console.error('Error creating video thumbnail');
        URL.revokeObjectURL(videoUrl);
        resolve(null);
      };
      
      // Start loading the video
      video.src = videoUrl;
      
      // Set a timeout in case the video never loads/errors
      setTimeout(() => {
        if (!video.duration) {
          console.warn('Video thumbnail creation timed out');
          URL.revokeObjectURL(videoUrl);
          resolve(null);
        }
      }, 5000);
    } catch (err) {
      console.error('Error in thumbnail creation:', err);
      resolve(null);
    }
  });
}
