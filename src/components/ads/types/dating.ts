export interface Ad {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  profile: {
    id: string;
    username: string;
    avatarUrl: string;
  };
}

export interface DatingAd {
  id: string;
  user_id: string;
  title: string;
  description: string;
  video_url: string;
  created_at: string;
  city: string;
  country: string;
  age_range: string;
  relationship_status: string;
  looking_for: string[];
  tags: string[];
  user: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export interface FilterOptions {
  [key: string]: string | string[];
}

export interface SearchCategory {
  seeker: "male" | "female" | "couple";
  looking_for: "male" | "female" | "couple" | "trans" | "any";
}
