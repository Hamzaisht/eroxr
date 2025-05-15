
import { ReactNode } from 'react';

export enum MediaTypes {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  ALL = 'all'
}

export interface MediaFile {
  file: File;
  preview: string;
  id: string;
}

export interface MediaUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  onUploadComplete?: (urls: string[]) => void;
  onComplete?: (url: string) => void;
  onError?: (error: string) => void;
  maxSizeInMB?: number;
  maxFiles?: number;
  bucket?: string;
  bucketName?: string;
  folderPath?: string;
  mediaTypes?: MediaTypes[] | string;
  className?: string;
  children?: ReactNode;
  showPreview?: boolean;
  autoUpload?: boolean;
  context?: string;
  buttonText?: string;
  onFileCapture?: (file: File) => void;
}

export interface FileUploadButtonProps {
  onFilesSelected: (files: File[]) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  allowedTypes: string[];
  buttonText: string;
  buttonVariant?: string;
  isUploading?: boolean;
  disabled?: boolean;
  maxFiles?: number;
  mediaTypes?: MediaTypes[];
  children?: ReactNode;
  className?: string;
}

export interface MediaPreviewProps {
  files?: MediaFile[];
  file?: File;
  previewUrl?: string;
  previewError?: string;
  previewLoading?: boolean;
  selectedFileInfo?: File;
  onRemove?: (id: string) => void;
  onClear?: () => void;
  isUploading?: boolean;
  className?: string;
}

// Constants for file validation
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime'
];
