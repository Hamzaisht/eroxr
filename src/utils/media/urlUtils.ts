
export function isVideoUrl(url: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.flv', '.mkv'];
  const lowercaseUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowercaseUrl.endsWith(ext));
}

export function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  const lowercaseUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowercaseUrl.endsWith(ext));
}

export function isAudioUrl(url: string): boolean {
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
  const lowercaseUrl = url.toLowerCase();
  return audioExtensions.some(ext => lowercaseUrl.endsWith(ext));
}

export function isDocumentUrl(url: string): boolean {
  const docExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'];
  const lowercaseUrl = url.toLowerCase();
  return docExtensions.some(ext => lowercaseUrl.endsWith(ext));
}

export function getPlayableMediaUrl(url: string): string {
  // Some services like Cloudinary need manipulations to make videos playable
  // For now, we'll just return the original URL
  return url;
}

export function getMediaType(url: string): string {
  if (isVideoUrl(url)) return 'video';
  if (isImageUrl(url)) return 'image';
  if (isAudioUrl(url)) return 'audio';
  if (isDocumentUrl(url)) return 'document';
  return 'unknown';
}

export function getThumbnailUrl(url: string): string {
  // If it's a video URL, we might want to get a thumbnail
  if (isVideoUrl(url)) {
    // This is a simple example that assumes a thumbnail with the same name but jpg extension
    // In a real app, you'd have a more robust solution or use a service that provides thumbnails
    return url.replace(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i, '.jpg');
  }
  return url;
}
