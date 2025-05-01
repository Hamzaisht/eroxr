
import { formatDistanceToNow, format } from 'date-fns';

// Format a date string to a relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
};

// Format a date string to a specific format
export const formatDateTime = (dateString: string, formatString: string = 'PPpp'): string => {
  try {
    const date = new Date(dateString);
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Invalid date';
  }
};

// Format file size to human readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format duration in seconds to MM:SS format
export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
};
