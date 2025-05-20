
import { MediaType } from '../types/media';
import { extractMediaUrl } from '@/utils/media/mediaUtils';

// Fix the extractMediaUrl call
const processMediaUrl = (src: string) => {
  const url = extractMediaUrl(src);
  return url;
};

export default processMediaUrl;
