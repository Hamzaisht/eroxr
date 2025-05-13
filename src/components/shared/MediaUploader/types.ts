
import { UploadOptions } from '@/utils/media/types';

export type MediaTypes = 'image' | 'video' | 'both';

export interface MediaUploaderProps {
  onComplete: (url: string) => void;
  onError?: (message: string) => void;
  context?: string;
  maxSizeInMB?: number;
  mediaTypes?: MediaTypes;
  buttonText?: string;
  buttonVariant?: string; 
  className?: string;
  showPreview?: boolean;
  autoUpload?: boolean;
  onFileCapture?: (file: File) => void;
}

export interface FileUploadButtonProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  allowedTypes: string[];
  buttonText: string;
  buttonVariant?: string;
  isUploading: boolean;
  maxSizeInMB?: number;
  mediaTypes?: MediaTypes;
  onClick?: () => void;
}

export interface MediaPreviewProps {
  file: File | null;
  previewUrl: string | null;
  previewError: string | null;
  previewLoading: boolean;
  selectedFileInfo: {
    name: string;
    type: string;
    size: number;
  } | null;
  onClear: () => void;
  isUploading: boolean;
}

export interface DebugInfoProps {
  uploadState: {
    isUploading: boolean;
    progress: number;
    error: string | null;
    isComplete: boolean;
  };
  fileInfo: {
    name?: string;
    type?: string;
    size?: number;
  } | null;
  selectedFileInfo?: {
    name: string;
    type: string;
    size: number;
  } | null;
  previewUrl?: string | null;
  previewLoading?: boolean;
  previewError?: string | null;
  hasSelectedFile?: boolean;
}

export interface UploadProgressProps {
  progress: number;
  isUploading: boolean;
  error?: string | null;
}
