
/**
 * Detect if a URL points to an image based on extension or query string
 */
export function isImageUrl(url: string): boolean {
  return (
    /\.(jpe?g|png|gif|webp|bmp|svg)($|\?)/.test(url.toLowerCase()) ||
    url.includes('image/') || 
    url.includes('content-type=image')
  );
}

/**
 * Detect if a URL points to a video based on extension or query string
 */
export function isVideoUrl(url: string): boolean {
  return (
    /\.(mp4|webm|mov|ogv|m4v|mkv)($|\?)/.test(url.toLowerCase()) ||
    url.includes('video/') ||
    url.includes('content-type=video')
  );
}

/**
 * Detect if a URL points to an audio file based on extension or query string
 */
export function isAudioUrl(url: string): boolean {
  return (
    /\.(mp3|wav|ogg|m4a)($|\?)/.test(url.toLowerCase()) ||
    url.includes('audio/') ||
    url.includes('content-type=audio')
  );
}

/**
 * Extract the file extension from a URL or filename
 */
export function getFileExtension(url: string): string | null {
  const match = url.match(/\.([a-zA-Z0-9]+)($|\?)/);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Extract the file name from a URL or path
 */
export function getFileName(url: string): string {
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  const queryIndex = lastPart.indexOf('?');
  return queryIndex > -1 ? lastPart.substring(0, queryIndex) : lastPart;
}

/**
 * Convert a string URL or path into a File object
 * Useful for processing URLs received from external sources
 */
export async function urlToFile(url: string, filename?: string): Promise<File | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch URL: ${url}, status: ${response.status}`);
      return null;
    }
    
    const blob = await response.blob();
    if (blob.size === 0) {
      console.error(`URL resulted in empty blob: ${url}`);
      return null;
    }
    
    // Use provided filename or extract from URL
    const name = filename || getFileName(url) || 'file';
    
    // Ensure file has proper extension based on content type
    let finalName = name;
    const contentType = blob.type;
    const fileExt = getFileExtension(name);
    
    if (contentType && !fileExt) {
      // Add extension based on content type if missing
      const ext = contentType.split('/')[1];
      if (ext) {
        finalName = `${name}.${ext}`;
      }
    }
    
    // Create new File object with proper name and type
    return new File([blob], finalName, { 
      type: contentType || 'application/octet-stream',
      lastModified: Date.now()
    });
  } catch (err) {
    console.error('Error converting URL to file:', err);
    return null;
  }
}

/**
 * Gets a playable media URL, adding cache-busting or other parameters as needed
 * 
 * @param url The raw media URL
 * @returns The processed URL ready for playback
 */
export function getPlayableMediaUrl(url: string | null): string {
  if (!url) return '';
  
  // Add cache busting for development environment
  if (process.env.NODE_ENV === 'development') {
    const cacheBuster = `_cb=${Date.now()}`;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${cacheBuster}`;
  }
  
  return url;
}
