
export enum MediaAccessLevel {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SUBSCRIBERS_ONLY = 'subscribers_only'
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio'
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  PENDING = 'pending'
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface UploadOptions {
  accessLevel?: MediaAccessLevel;
  category?: string;
  metadata?: Record<string, any>;
}
