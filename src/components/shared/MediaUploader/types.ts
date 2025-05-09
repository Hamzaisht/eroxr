
import { UploadOptions } from '@/utils/media/types';

/**
 * Props for the MediaUploader component
 */
export interface MediaUploaderProps {
  /**
   * Function called when upload completes successfully
   */
  onComplete?: (url: string) => void;
  
  /**
   * Function called when upload fails
   */
  onError?: (error: string) => void;
  
  /**
   * Content type category ('story', 'post', etc)
   */
  context?: string;
  
  /**
   * Maximum file size in MB
   */
  maxSizeInMB?: number;
  
  /**
   * Allow only specific media types
   */
  mediaTypes?: 'image' | 'video' | 'both';
  
  /**
   * Custom button text
   */
  buttonText?: string;
  
  /**
   * Button variant
   */
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
  
  /**
   * Additional CSS class for the container
   */
  className?: string;

  /**
   * Whether to show media preview
   */
  showPreview?: boolean;

  /**
   * Whether to auto-upload on file selection
   */
  autoUpload?: boolean;
  
  /**
   * Function to capture the raw File object reference 
   * before any processing or serialization
   */
  onFileCapture?: (file: File) => void;
}
