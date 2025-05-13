
/**
 * Result type for media upload operations
 */
export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  isComplete: boolean;
  result?: UploadResult;
}
