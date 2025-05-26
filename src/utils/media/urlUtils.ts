
export const getPlayableMediaUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's already a complete URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative path, construct the full URL
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }
  
  return url;
};
