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
  social_links?: Record<string, any> | null;
  profile_visibility?: boolean | null;
  is_paying_customer?: boolean | null;
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
  social_links?: Record<string, any> | null;
  profile_visibility?: boolean | null;
  is_paying_customer?: boolean | null;
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
  social_links?: Record<string, any> | null;
  profile_visibility?: boolean | null;
  is_paying_customer?: boolean | null;
};