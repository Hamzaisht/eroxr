
import { MediaType } from './media/types';
import { getPlayableMediaUrl } from './media/mediaUrlUtils';

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

export const getMediaTypeFromFile = (file: File): MediaType => {
  if (isImageFile(file)) {
    return MediaType.IMAGE;
  } else if (isVideoFile(file)) {
    return MediaType.VIDEO;
  } else {
    return MediaType.UNKNOWN;
  }
};

// Re-export the getPlayableMediaUrl function
export { getPlayableMediaUrl };
