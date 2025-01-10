import type { Json } from './database.types';

export type Profile = {
  id: string;
  username?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  created_at: string;
  updated_at: string;
  is_age_verified?: boolean | null;
  date_of_birth?: string | null;
  id_verification_status?: string | null;
  bio?: string | null;
  location?: string | null;
  interests?: string[] | null;
  social_links?: Json | null;
  profile_visibility?: boolean | null;
  is_paying_customer?: boolean | null;
  first_name?: string | null;
  last_name?: string | null;
  is_suspended?: boolean | null;
  suspended_at?: string | null;
  status?: 'online' | 'offline' | 'away' | 'busy' | null;
};

export type ProfileInsert = {
  id: string;
  username?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  created_at?: string;
  updated_at?: string;
  is_age_verified?: boolean | null;
  date_of_birth?: string | null;
  id_verification_status?: string | null;
  bio?: string | null;
  location?: string | null;
  interests?: string[] | null;
  social_links?: Json | null;
  profile_visibility?: boolean | null;
  is_paying_customer?: boolean | null;
  first_name?: string | null;
  last_name?: string | null;
  is_suspended?: boolean | null;
  suspended_at?: string | null;
};

export type ProfileUpdate = {
  id?: string;
  username?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  created_at?: string;
  updated_at?: string;
  is_age_verified?: boolean | null;
  date_of_birth?: string | null;
  id_verification_status?: string | null;
  bio?: string | null;
  location?: string | null;
  interests?: string[] | null;
  social_links?: Json | null;
  profile_visibility?: boolean | null;
  is_paying_customer?: boolean | null;
  first_name?: string | null;
  last_name?: string | null;
  is_suspended?: boolean | null;
  suspended_at?: string | null;
};
