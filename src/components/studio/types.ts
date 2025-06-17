
export interface StudioProfile {
  id: string;
  username?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  banner_url?: string;
  interests?: string[];
  is_verified?: boolean;
  created_at: string;
  updated_at: string;
  profile_visibility?: boolean;
  first_name?: string;
  last_name?: string;
  status?: string;
}

export interface MediaUploadOptions {
  bucket: string;
  path: string;
  file: File;
  onProgress?: (progress: number) => void;
}

export interface ProfileUpdateData {
  username?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  banner_url?: string;
  interests?: string[];
}
