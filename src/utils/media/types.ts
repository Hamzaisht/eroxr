
// Define all media-related types

// Availability status for users
export enum AvailabilityStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
  INVISIBLE = 'invisible'
}

// Media types
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  OTHER = 'other'
}

// File upload state
export enum UploadState {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// Media permissions
export enum MediaPermission {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SUBSCRIBERS = 'subscribers',
  PAID = 'paid'
}

// Media filtering options
export type MediaFilterOptions = {
  types?: MediaType[];
  permissions?: MediaPermission[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  searchQuery?: string;
}
