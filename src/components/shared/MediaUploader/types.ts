
export interface MediaUploaderProps {
  onComplete?: (url: string) => void;
  onError?: (error: string) => void;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  bucketName?: string;
  contentCategory?: string;
  buttonText?: string;
  onFileCapture?: (file: File) => void;
  context?: string;
  maxFiles?: number;
}
