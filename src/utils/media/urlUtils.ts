
import { MediaAccessLevel } from './types';

export const getPlayableMediaUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's already a full URL, return as is
  if (url.startsWith('http')) {
    return url;
  }
  
  // If it's a Supabase storage path, construct the full URL
  if (url.startsWith('media/')) {
    return `https://ysqbdaeohlupucdmivkt.supabase.co/storage/v1/object/public/media/${url.replace('media/', '')}`;
  }
  
  return url;
};

export const shouldBlurMedia = (accessLevel: MediaAccessLevel, canAccess: boolean): boolean => {
  if (canAccess) return false;
  return accessLevel !== MediaAccessLevel.PUBLIC;
};

export const getPreviewDuration = (accessLevel: MediaAccessLevel): number => {
  // PPV content gets a 10-second preview
  if (accessLevel === MediaAccessLevel.PPV) return 10;
  return 0;
};

export const generateSecureUrl = async (url: string, accessLevel: MediaAccessLevel): Promise<string> => {
  // For now, just return the playable URL
  // In the future, this could generate signed URLs for private content
  return getPlayableMediaUrl(url);
};
