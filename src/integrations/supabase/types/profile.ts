
export interface Profile {
  id: string;
  username?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  bio?: string | null;
  location?: string | null;
  interests?: string[] | null;
  profile_visibility?: boolean;
  is_verified?: boolean;
  created_at: string;
  updated_at: string;
}

// Simplified creator type for components that need basic creator info
export interface Creator {
  id: string;
  username?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Basic profile for minimal data needs
export interface BasicProfile {
  id: string;
  username: string;
  avatar_url: string | null;
}
