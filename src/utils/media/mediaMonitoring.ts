
import { MediaErrorType } from './types';

interface MediaErrorReport {
  url: string | null;
  type: MediaErrorType;
  component: string;
  retryCount: number;
  timestamp: number;
  mediaType: 'image' | 'video' | 'audio' | 'unknown';
  additionalInfo?: Record<string, any>;
}

// Track errors for potential reporting and analysis
const mediaErrors: MediaErrorReport[] = [];

/**
 * Report a media error for monitoring and potential intervention
 */
export function reportMediaError(
  url: string | null,
  errorType: string,
  retryCount: number = 0,
  mediaType: 'image' | 'video' | 'audio' | 'unknown' = 'unknown',
  component: string = 'unknown',
  additionalInfo: Record<string, any> = {}
): void {
  const errorReport: MediaErrorReport = {
    url,
    type: errorType as MediaErrorType || MediaErrorType.UNKNOWN,
    component,
    retryCount,
    timestamp: Date.now(),
    mediaType,
    additionalInfo
  };
  
  console.error('Media error:', errorReport);
  
  // Store the error report for potential analysis
  mediaErrors.push(errorReport);
}

/**
 * Get media error statistics
 */
export function getMediaErrorStats(): { 
  total: number, 
  byType: Record<string, number>,
  byComponent: Record<string, number>
} {
  const stats = {
    total: mediaErrors.length,
    byType: {} as Record<string, number>,
    byComponent: {} as Record<string, number>
  };
  
  // Compute stats
  mediaErrors.forEach(error => {
    // By error type
    if (!stats.byType[error.type]) {
      stats.byType[error.type] = 0;
    }
    stats.byType[error.type]++;
    
    // By component
    if (!stats.byComponent[error.component]) {
      stats.byComponent[error.component] = 0;
    }
    stats.byComponent[error.component]++;
  });
  
  return stats;
}

/**
 * Reset error tracking (e.g., after analyzing or reporting)
 */
export function clearMediaErrorTracking(): void {
  mediaErrors.length = 0;
}
