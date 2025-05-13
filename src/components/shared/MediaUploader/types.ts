
export interface MediaUploaderProps {
  /** Function called when upload completes with the public URL */
  onComplete?: (url: string) => void;
  /** Function called when an error occurs */
  onError?: (message: string) => void;
  /** Context for the upload (determines bucket and path) */
  context?: 'profile' | 'post' | 'story' | 'message' | 'shorts' | 'generic';
  /** Maximum size in MB */
  maxSizeInMB?: number;
  /** Types of media to accept */
  mediaTypes?: 'image' | 'video' | 'both';
  /** Button text */
  buttonText?: string;
  /** Button variant */
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'link' | 'secondary' | 'destructive';
  /** Additional classes */
  className?: string;
  /** Show preview */
  showPreview?: boolean;
  /** Auto upload after selection */
  autoUpload?: boolean;
  /** Capture file without uploading */
  onFileCapture?: (file: File) => void;
}

export interface FileInfo {
  name: string;
  type: string;
  size: number;
}
