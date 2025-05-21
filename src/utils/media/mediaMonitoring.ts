
import { MediaType } from './types';

interface MediaError {
  url: string;
  type: string;
  retryCount: number;
  mediaType: string;
  component: string;
  timestamp: number;
}

let mediaErrorLog: MediaError[] = [];

/**
 * Report a media error for monitoring
 */
export const reportMediaError = (
  url: string,
  type: string,
  retryCount: number = 0,
  mediaType: string = 'unknown',
  component: string = 'unknown'
): void => {
  const error: MediaError = {
    url,
    type,
    retryCount,
    mediaType,
    component,
    timestamp: Date.now()
  };
  
  console.error(`Media error: ${type} - URL: ${url}`, error);
  mediaErrorLog.push(error);
  
  // Prevent log from growing too large
  if (mediaErrorLog.length > 100) {
    mediaErrorLog = mediaErrorLog.slice(-50);
  }
};

/**
 * Get all logged media errors
 */
export const getMediaErrorLog = (): MediaError[] => {
  return mediaErrorLog;
};

/**
 * Clear the media error log
 */
export const clearMediaErrorLog = (): void => {
  mediaErrorLog = [];
};
