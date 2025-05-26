
export const getMediaUrl = (path: string, bucket: string = 'media'): string => {
  if (!path) return '';
  
  // If it's already a full URL, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // Construct Supabase storage URL
  return `https://ysqbdaeohlupucdmivkt.supabase.co/storage/v1/object/public/${bucket}/${path}`;
};

export const isValidMediaUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
