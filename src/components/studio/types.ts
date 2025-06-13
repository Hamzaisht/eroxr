
export interface StudioProfile {
  id: string;
  username: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  interests: string[] | null;
  profile_visibility: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  message?: string;
}

export interface MediaUploadOptions {
  maxSize: number;
  allowedTypes: string[];
  bucket: string;
}
