
// Define the types of errors we'll track
type MediaErrorType = 'load_failure' | 'format_unsupported' | 'corruption' | 'timeout' | 'other';

// Structure for error report
interface MediaErrorReport {
  url: string;
  errorType: MediaErrorType;
  timestamp: number;
  retryCount: number;
  userAgent: string;
  mediaType: string;
  context?: string;
}

// In-memory storage for errors (will be cleared on page refresh)
const errorLog: MediaErrorReport[] = [];
const ERROR_LOG_LIMIT = 100; // Prevent memory issues by limiting number of errors stored

/**
 * Reports a media error for monitoring and analysis
 */
export const reportMediaError = (
  url: string | null | undefined,
  errorType: MediaErrorType,
  retryCount: number = 0,
  mediaType: string = 'unknown',
  context?: string
) => {
  if (!url) return;
  
  // Don't report localhost or blob URLs in production
  if (process.env.NODE_ENV === 'production') {
    if (url.startsWith('blob:') || url.includes('localhost') || url.includes('127.0.0.1')) {
      return;
    }
  }
  
  // Create error report
  const report: MediaErrorReport = {
    url,
    errorType,
    timestamp: Date.now(),
    retryCount,
    userAgent: navigator.userAgent,
    mediaType,
    context
  };
  
  // Add to in-memory log (removing oldest if at limit)
  if (errorLog.length >= ERROR_LOG_LIMIT) {
    errorLog.shift();
  }
  errorLog.push(report);
  
  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`Media Error [${errorType}]: ${url}`, report);
  }
  
  // In production we could send this to an analytics service or backend
  if (process.env.NODE_ENV === 'production') {
    // Sample implementation - send to your analytics/monitoring service
    // sendToAnalytics('media_error', report);
    
    // Alternatively, save to localStorage for later batch processing
    try {
      const existingErrors = JSON.parse(localStorage.getItem('media_errors') || '[]');
      if (existingErrors.length >= 50) existingErrors.shift();
      existingErrors.push(report);
      localStorage.setItem('media_errors', JSON.stringify(existingErrors));
    } catch (e) {
      // Silent fail if localStorage isn't available
    }
  }
};

/**
 * Get all logged media errors (for admin/debugging purposes)
 */
export const getMediaErrors = (): MediaErrorReport[] => {
  return [...errorLog];
};

/**
 * Clear the error log
 */
export const clearMediaErrors = (): void => {
  errorLog.length = 0;
  
  try {
    localStorage.removeItem('media_errors');
  } catch (e) {
    // Silent fail
  }
};

/**
 * Check if media URL is likely to be valid
 */
export const validateMediaUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  
  // Validate URL format
  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  
  // Check for common patterns that indicate invalid media URLs
  const invalidPatterns = [
    'undefined', 
    'null', 
    'NaN',
    '[object Object]',
    'data:,',
    'about:blank',
  ];
  
  for (const pattern of invalidPatterns) {
    if (url.includes(pattern)) return false;
  }
  
  return true;
};
