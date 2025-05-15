
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
  maxSizeInMB?: number;
  maxFiles?: number;
  bucket?: string;
  folderPath?: string;
  mediaTypes?: MediaTypes[];
  className?: string;
  children?: ReactNode;
  showPreview?: boolean;
  autoUpload?: boolean;
}

export interface FileUploadButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  mediaTypes?: MediaTypes[];
  children?: ReactNode;
  className?: string;
}

export interface MediaPreviewProps {
  files: MediaFile[];
  onRemove: (id: string) => void;
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
