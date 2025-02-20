
export interface FeaturedCreator {
  id: string;
  username: string;
  avatar_url: string | null;
  subscriber_count: number;
  is_exclusive: boolean;
  status: 'online' | 'offline' | 'live';
}

export interface PlatformNews {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  category: 'update' | 'announcement' | 'promotion';
  cta?: {
    text: string;
    url: string;
  };
}

export interface LiveStream {
  id: string;
  title: string;
  thumbnail_url: string;
  viewer_count: number;
  creator: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  started_at: string;
}
