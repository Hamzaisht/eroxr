
export interface FileUploadButtonProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  allowedTypes: string[];
  buttonText: string;
  buttonVariant?: string;
  isUploading: boolean;
}

export interface MediaPreviewProps {
  file: File | null;
  previewUrl: string | null;
  previewError: string | null;
  previewLoading: boolean;
  selectedFileInfo: { name: string; type: string; size: number } | null;
  onClear: () => void;
  isUploading: boolean;
}

export type MediaTypes = 'image' | 'video' | 'both';

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
  folderPath?: string;
  mediaTypes?: MediaTypes;
  className?: string;
  showPreview?: boolean;
  autoUpload?: boolean;
}
