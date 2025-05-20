
import { MediaType } from '@/types/media';
import { extractMediaUrl } from '@/utils/media/mediaUtils';

// Fix the string | string[] type issue
const processMediaUrl = (mediaUrl: string | string[]) => {
  const url = Array.isArray(mediaUrl) ? mediaUrl[0] : mediaUrl;
  return url;
};

// Fix the extractMediaUrl call
const extractMediaUrlWrapper = (src: string) => {
  const extractedUrl = extractMediaUrl(src);
  return extractedUrl;
};

export { processMediaUrl, extractMediaUrlWrapper };
