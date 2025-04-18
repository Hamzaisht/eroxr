
export interface Profile {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  status?: 'online' | 'offline' | 'away' | 'busy' | null;
  created_at: string;
  updated_at: string;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
  has_stories?: boolean;
  is_verified?: boolean;
  role?: string | null;
}
