
/**
 * Adds cache busting to media URLs if needed
 */
export const getPlayableMediaUrl = (url: string | null): string | null => {
  if (!url) return null;
  
  // Check if this is a cloud-hosted URL (Supabase, etc)
  const isCloudUrl = url.includes('supabase');
  
  // Add cache busting only for cloud URLs
  if (isCloudUrl) {
    const cacheBuster = `t=${Date.now()}`;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${cacheBuster}`;
  }
  
  return url;
};

/**
 * Determines media type from URL or file extension
 */
export const getMediaType = (url: string | null): string => {
  if (!url) return 'unknown';
  
  const extension = url.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(extension || '')) {
    return 'image';
  } else if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension || '')) {
    return 'video';
  } else if (['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].includes(extension || '')) {
    return 'audio';
  }
  
  // Try to infer from the URL path/query
  const urlLower = url.toLowerCase();
  if (urlLower.includes('/image/') || urlLower.includes('image=') || urlLower.includes('type=image')) {
    return 'image';
  } else if (urlLower.includes('/video/') || urlLower.includes('video=') || urlLower.includes('type=video')) {
    return 'video';
  } else if (urlLower.includes('/audio/') || urlLower.includes('audio=') || urlLower.includes('type=audio')) {
    return 'audio';
  }
  
  return 'unknown';
};
